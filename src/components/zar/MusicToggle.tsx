import { Music, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import defaultMusic from "@/leberch-romantic-584475.mp3";

/**
 * Music playback component.
 * - Autoplays on page load (if the tab is visible).
 * - Pauses when the tab becomes hidden.
 * - User can manually toggle playback via the button.
 * - When the user disables music, it stays off until re‑enabled.
 */
export function MusicToggle({ url }: { url?: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [userWantsPlaying, setUserWantsPlaying] = useState(true); // default on

  const audioSrc = url || defaultMusic;

  // Try to start playback when the component mounts.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only autoplay if the document is visible.
    if (document.visibilityState === "visible") {
      void audio.play().then(() => setPlaying(true), () => setPlaying(false));
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        audio.pause();
        setPlaying(false);
      } else if (userWantsPlaying) {
        void audio.play().then(() => setPlaying(true), () => setPlaying(false));
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
      void audio.play().then(() => setPlaying(true), () => setPlaying(false));
    }
  };

  if (!audioSrc) return null;

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" autoPlay />
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
