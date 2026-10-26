type EmbedPlayerProps = {
  src: string;
};

// Прямой iframe-embed внешнего плеера (vidsrc, 2embed и т.п.)
export default function EmbedPlayer({ src }: EmbedPlayerProps) {
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <iframe
        src={src}
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
