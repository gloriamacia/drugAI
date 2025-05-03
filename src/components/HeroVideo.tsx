// components/HeroVideo.tsx
import { FC, useRef, useEffect } from "react";

export const HeroVideo: FC<{
  webm: string;
  mp4: string;
  playbackRate?: number;
}> = ({ webm, mp4, playbackRate = 0.75 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div className="w-full overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-auto object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
};
