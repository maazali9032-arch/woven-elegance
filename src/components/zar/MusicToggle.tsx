import { Music, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Optional music. Never autoplays — playback begins on user interaction only. */
export function MusicToggle({ url, title }: { url: string; title?: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : `Play music${title ? `: ${title}` : ""}`}
        className="fixed left-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-full border border-zar-gold/50 bg-zar-burgundy-deep/70 text-zar-cream backdrop-blur-sm transition-colors hover:bg-zar-burgundy/80"
      >
        {playing ? <Pause size={15} /> : <Music size={15} />}
      </button>
    </>
  );
}
