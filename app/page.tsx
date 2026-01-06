"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Home() {
  const sections = useQuery(api.sections.list);

  if (sections === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center ">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 ">
      <div className="w-full max-w-3xl">
        <div className="text-center my-16 space-y-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-[#CF1662] fill-[#CF1662]" />
            <h1 className="text-5xl text-[#CF1662] sm:text-7xl font-styled">
              neme's world
            </h1>
            <Heart className="w-8 h-8 text-[#CF1662] fill-[#CF1662]" />
          </div>
          <p className="text-base font-secondary">
            curated with love, just for you
          </p>
        </div>

        <div className="relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>

          <div className="relative backdrop-blur-sm bg-white/60 border-2 border-pink-100 p-4 lg:p-6">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-3 h-3 text-pink-500" />
              <h5 className="text-base font-semibold text-gray-800 font-secondary">
                things i'm loving right now
              </h5>
              <Sparkles className="w-3 h-3 text-pink-500" />
            </div>

            {sections.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <Heart className="w-16 h-16 mx-auto text-pink-300" />
                </div>
                <p className="text-gray-500 text-lg">
                  building my collection... check back soon! ♡
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {sections.map((section, index) => (
                  <Link
                    key={section._id}
                    href={`/list/${section._id}`}
                    className="group relative"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="relative w-full bg-white p-6 border-2 border-pink-200 transition-all duration-300 hover:shadow-2xl group-hover:border-pink-300">
                      <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 min-h-[140px]">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-pink-600 transition-colors">
                            {section.title}
                          </h2>
                          {section.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {section.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-pink-100">
                          <span className="text-xs text-gray-500 font-medium">
                            see collection
                          </span>
                          <div className="flex items-center gap-1 text-pink-500 group-hover:gap-2 transition-all">
                            <span className="text-sm font-semibold">♡</span>
                            <svg
                              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {sections.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-xs italic">
                  updated with new finds regularly ✨
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-xs">
          some links may earn me a small commission at no extra cost to you
        </div>
      </div>
    </main>
  );
}
