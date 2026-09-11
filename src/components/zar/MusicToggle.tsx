import { Music, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import defaultMusic from "@/leberch-romantic-584475.mp3";

/** Optional music. Never autoplays — playback begins on user interaction only. */
export function MusicToggle({ url }: { url?: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [userWantsPlaying, setUserWantsPlaying] = useState(false);

  const audioSrc = url || defaultMusic;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        audio.pause();
        setPlaying(false);
      } else if (document.visibilityState === "visible" && userWantsPlaying) {
        void audio.play().then(
          () => setPlaying(true),
          () => setPlaying(false),
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
    };
  }, [userWantsPlaying]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setUserWantsPlaying(false);
    } else {
      setUserWantsPlaying(true);
      void audio.play().then(
        () => setPlaying(true),
        () => {
          setPlaying(false);
          setUserWantsPlaying(false);
        },
      );
    }
  };

  if (!audioSrc) return null;

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed left-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-full border border-zar-gold/50 bg-zar-burgundy-deep/70 text-zar-cream backdrop-blur-sm transition-colors hover:bg-zar-burgundy/80"
      >
        {playing ? <Pause size={15} /> : <Music size={15} />}
      </button>
    </>
  );
}
