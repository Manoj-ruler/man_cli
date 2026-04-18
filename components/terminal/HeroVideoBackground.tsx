"use client";

import React, { useEffect, useRef } from "react";

interface HeroVideoBackgroundProps {
  videoSrc: string;
}

export function HeroVideoBackground({ videoSrc }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Auto-play the video
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Video as background - visible but subtle */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.35 }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlays to blend with background */}
      <div className="absolute inset-0 bg-bg/40" />
      <div className="absolute inset-0 bg-gradient-to-l from-bg via-bg/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-bg/20" />

      {/* Subtle pink glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink/8 blur-[120px] rounded-full" />
    </div>
  );
}


