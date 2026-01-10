import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.entry) {
      return NextResponse.json({ status: "no_entry" });
    }

    for (const entry of body.entry) {
      if (!entry.changes) continue;

      for (const change of entry.changes) {
        if (change.field === "comments" && change.value) {
          await handleCommentEvent(change.value);
        }

        if (change.field === "messages" && change.value) {
          await handleDMEvent(change.value);
        }
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleCommentEvent(comment: any) {
  try {
    const commentId = comment.id;
    const commentText = comment.text?.toLowerCase().trim();
    const mediaId = comment.media?.id;
    const userId = comment.from?.id;
    const username = comment.from?.username;

    if (!commentText || !mediaId || !userId || !username) {
      return;
    }

    const mapping = await convex.query(api.instagram.findMappingForComment, {
      reelId: mediaId,
      commentText,
    });

    if (!mapping) {
      return;
    }

    const fullMapping = await convex.query(api.instagram.getReelMappingById, {
      id: mapping.mappingId,
    });

    const jobId = await convex.mutation(api.dmQueue.createDmJob, {
      instagramUserId: userId,
      username,
      sectionId: mapping.sectionId,
      reelId: mediaId,
      triggerType: "comment",
      triggerId: commentId,
      maxItemsInDM: fullMapping?.maxItemsInDM ?? 10,
      includeWebsiteLink: fullMapping?.includeWebsiteLink ?? true,
    });

    if (jobId) {
      console.log("DM job created:", jobId);
    }
  } catch (error) {
    console.error("handleCommentEvent error:", error);
  }
}

async function handleDMEvent(message: any) {
  try {
    const messageId = message.mid;
    const messageText = message.message?.text;
    const userId = message.from?.id;
    const username = message.from?.username;

    if (!messageText || !userId || !username || !messageId) {
      return;
    }

    const reelMatch = messageText.match(
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/
    );
    if (!reelMatch) {
      return;
    }

    const reelId = reelMatch[1];

    const mapping = await convex.query(api.instagram.findMappingForReel, {
      reelId,
    });

    if (!mapping) {
      return;
    }

    const fullMapping = await convex.query(api.instagram.getReelMappingById, {
      id: mapping.mappingId,
    });

    const jobId = await convex.mutation(api.dmQueue.createDmJob, {
      instagramUserId: userId,
      username,
      sectionId: mapping.sectionId,
      reelId,
      triggerType: "dm",
      triggerId: messageId,
      maxItemsInDM: fullMapping?.maxItemsInDM ?? 10,
      includeWebsiteLink: fullMapping?.includeWebsiteLink ?? true,
    });

    if (jobId) {
      console.log("DM job created from inbox message:", jobId);
    }
  } catch (error) {
    console.error("handleDMEvent error:", error);
  }
}
