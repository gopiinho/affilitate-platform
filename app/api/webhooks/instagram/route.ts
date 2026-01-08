import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

const dmRateLimit = new Map<string, { count: number; resetTime: number }>();

function checkDMRateLimit(userId: string): {
  allowed: boolean;
  reason?: string;
} {
  const now = Date.now();
  const userLimit = dmRateLimit.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or first time
    dmRateLimit.set(userId, {
      count: 0,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return { allowed: true };
  }

  if (userLimit.count >= 50) {
    return {
      allowed: false,
      reason: "DM rate limit exceeded for this user (50/hour)",
    };
  }

  return { allowed: true };
}

function incrementDMRateLimit(userId: string) {
  const userLimit = dmRateLimit.get(userId);
  if (userLimit) {
    userLimit.count++;
  }
}

// Webhook verification (unchanged)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("🔐 Webhook verification:", { mode });

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully");
    return new NextResponse(challenge, { status: 200 });
  }

  console.log("❌ Webhook verification failed");
  return new NextResponse("Forbidden", { status: 403 });
}

// Webhook handler (updated)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📨 Webhook event received");

    if (!body.entry) {
      return NextResponse.json({ status: "no_entry" });
    }

    for (const entry of body.entry) {
      if (!entry.changes) continue;

      for (const change of entry.changes) {
        if (change.field === "comments" && change.value) {
          await handleCommentEvent(change.value);
        }
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
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

    console.log("💬 Processing comment:", { commentText, mediaId, username });

    if (!commentText || !mediaId || !userId || !username) {
      console.log("⚠️ Missing required data");
      return;
    }

    const rateLimitCheck = await convex.query(api.instagram.checkRateLimit);
    if (!rateLimitCheck.allowed) {
      console.log("⚠️ API rate limit exceeded:", rateLimitCheck.reason);
      await convex.mutation(api.instagram.logComment, {
        commentId,
        reelId: mediaId,
        instagramUserId: userId,
        username,
        commentText,
        keyword: commentText,
        dmSent: false,
        dmError: "API rate limit exceeded",
      });
      return;
    }

    const dmLimitCheck = checkDMRateLimit(userId);
    if (!dmLimitCheck.allowed) {
      console.log("⚠️ DM rate limit exceeded for user:", username);
      await convex.mutation(api.instagram.logComment, {
        commentId,
        reelId: mediaId,
        instagramUserId: userId,
        username,
        commentText,
        keyword: commentText,
        dmSent: false,
        dmError: dmLimitCheck.reason,
      });
      return;
    }

    // Find mapping
    const mapping = await convex.query(api.instagram.findMappingForComment, {
      reelId: mediaId,
      commentText,
    });

    if (!mapping) {
      console.log("❌ No mapping found");
      await convex.mutation(api.instagram.logComment, {
        commentId,
        reelId: mediaId,
        instagramUserId: userId,
        username,
        commentText,
        keyword: commentText,
        dmSent: false,
        dmError: "No mapping found",
      });
      return;
    }

    console.log("✅ Found mapping:", mapping.sectionTitle);

    const fullMapping = await convex.query(api.instagram.getReelMappingById, {
      id: mapping.mappingId,
    });

    const dmResult = await sendInstagramDM(
      userId,
      username,
      mapping.sectionId,
      fullMapping?.maxItemsInDM ?? 10,
      fullMapping?.includeWebsiteLink ?? true
    );

    if (dmResult.success) {
      incrementDMRateLimit(userId);
      await convex.mutation(api.instagram.incrementRateLimit);
    }

    // Log everything
    await convex.mutation(api.instagram.logComment, {
      commentId,
      reelId: mediaId,
      instagramUserId: userId,
      username,
      commentText,
      keyword: mapping.keyword,
      sectionId: mapping.sectionId,
      dmSent: dmResult.success,
      dmError: dmResult.error,
    });

    await convex.mutation(api.instagram.logDM, {
      instagramUserId: userId,
      username,
      sectionId: mapping.sectionId,
      messageText: dmResult.messageText || "",
      success: dmResult.success,
      error: dmResult.error,
    });

    console.log("✉️ DM result:", dmResult.success ? "Success" : dmResult.error);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

async function sendInstagramDM(
  userId: string,
  username: string,
  sectionId: string,
  maxItems: number,
  includeWebsiteLink: boolean
): Promise<{ success: boolean; error?: string; messageText?: string }> {
  try {
    const config = await convex.query(api.instagram.getConfig);

    if (!config) {
      return { success: false, error: "Not configured" };
    }

    // Generate message
    const messageData = await convex.query(api.instagram.generateDMMessage, {
      sectionId: sectionId as any,
      maxItems,
      includeWebsiteLink,
    });

    let messageText = messageData.message;

    // Instagram limit: 1000 characters
    if (messageText.length > 1000) {
      messageText =
        messageText.substring(0, 950) + "\n\n... (visit link for full list)";
    }

    // Use v24.0
    const url = `https://graph.instagram.com/v24.0/me/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: userId },
        message: { text: messageText },
        access_token: config.accessToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API error:", data);
      return {
        success: false,
        error: data.error?.message || "Unknown error",
        messageText,
      };
    }

    return { success: true, messageText };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
