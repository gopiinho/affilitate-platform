"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Heart } from "lucide-react";
import heartPixel from "@/public/icons/heart.png";
import Cat from "@/components/Cat";
import CollectionsCard from "@/components/CollectionCard";

export default function Home() {
  const sections = useQuery(api.sections.list);

  if (sections === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center max-sm:my-12 max-sm:mb-24 sm:my-16 space-y-4">
          <div className="inline-flex justify-center items-center gap-2 mb-2">
            <Image
              src={heartPixel.src}
              alt="heart pixel"
              width={32}
              height={32}
              className="w-5 h-5 sm:w-7.5 sm:h-7.5"
            />
            <h1 className="text-5xl text-[#CF1662] sm:text-7xl font-secondary">
              neme's world
            </h1>
            <Image
              src={heartPixel.src}
              alt="heart pixel"
              width={32}
              height={32}
              className="w-5 h-5 sm:w-7.5 sm:h-7.5"
            />
          </div>
        </div>

        <div className="relative">
          <Cat />

          <div className="relative backdrop-blur-sm bg-white/60 border-2 border-pink-100 p-4 lg:p-6">
            <div className="flex items-center justify-center font-secondary gap-2 mb-8">
              <p className="text-[#CF1662]">⋆｡˚ ✧</p>
              <h5 className="text-xl font-secondary">my collections</h5>
              <p className="text-[#CF1662]">✧ ⋆｡˚</p>
            </div>

            {sections.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto text-pink-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  building my collection... check back soon! ♡
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {sections.map((section, index) => (
                  <CollectionsCard
                    key={section._id}
                    section={section}
                    index={index}
                  />
                ))}
              </div>
            )}
            <div className="text-[#CF1662] w-full">
              <div className="text-center flex flex-col items-center justify-center mt-8 text-[0.6rem]">
                <p>
                  If you purchase from any of these links, I may receive a small
                  commission.
                </p>
                <div className="flex gap-1 items-center justify-center">
                  Thank youuu for the support
                  <Image
                    src={heartPixel.src}
                    alt="heart pixel"
                    width={5}
                    height={5}
                    className="w-2 h-2 sm:w-2 sm:h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
