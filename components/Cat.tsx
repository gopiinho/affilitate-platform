"use client";

import Image from "next/image";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import pixelCat from "@/public/pixel-cat.gif";
import { AnimatePresence, motion } from "motion/react";

type Heart = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

export default function Cat() {
  const catCount = useQuery(api.catCounter.get);
  const incrementCat = useMutation(api.catCounter.increment);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const handleCatClick = () => {
    incrementCat();

    const count = Math.floor(Math.random() * 2) + 2;
    const now = Date.now();

    const newHearts: Heart[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 18 + 10;

      return {
        id: now + i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: Math.random() * 6 + 10,
        duration: Math.random() * 0.5 + 0.5,
        delay: i * 0.08,
      };
    });

    setHearts((prev) => [...prev, ...newHearts]);
  };

  return (
    <div className="absolute -top-28 font-secondary sm:-top-40 right-0 flex flex-col items-center gap-1">
      <div className="relative">
        <Image
          src={pixelCat}
          alt="pixel cat"
          className="h-20 sm:h-30 w-auto cursor-pointer select-none"
          onClick={handleCatClick}
        />

        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.span
              key={heart.id}
              className="absolute left-1/2 top-1/2 pointer-events-none"
              style={{
                fontSize: heart.size,
                color: "#CF1662",
              }}
              initial={{
                opacity: 0,
                scale: 0.6,
                x: heart.x,
                y: heart.y,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: 1,
                x: heart.x * 1.4,
                y: heart.y - 35,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: heart.duration,
                delay: heart.delay,
                ease: "easeOut",
              }}
              onAnimationComplete={() =>
                setHearts((h) => h.filter((x) => x.id !== heart.id))
              }
            >
              ❤️
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div
        className="flex gap-0.5 bg-pink-100 p-1   shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.15),0_2px_0_rgba(0,0,0,0.15)]
          border border-pink-300
          rounded-[2px]"
      >
        {String(catCount ?? 0)
          .padStart(7, "0")
          .split("")
          .map((digit, i) => (
            <div
              key={i}
              className="
          relative
          w-2 h-3 sm:w-3 sm:h-5
          bg-pink-200
          flex items-center justify-center
          font-mono text-xs sm:text-sm text-primary

        
        "
            >
              <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
              <span className="relative z-10 leading-none">{digit}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
