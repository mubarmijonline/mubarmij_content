import Image from "next/image";

export type VideoEntry = {
  source: "youtube" | "vimeo" | "upload";
  url?: string;
  fileUrl?: string;
  title?: string;
  thumbnail?: string;
};

/** Convert a YouTube/Vimeo watch URL into the matching embed URL. */
function toEmbedUrl(source: VideoEntry["source"], url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (source === "youtube") {
      // youtu.be/<id> or youtube.com/watch?v=<id>
      const id =
        u.hostname.includes("youtu.be")
          ? u.pathname.replace(/^\//, "")
          : u.searchParams.get("v") || u.pathname.split("/").pop() || "";
      if (!id) return null;
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (source === "vimeo") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function VideoList({ videos }: { videos: VideoEntry[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {videos.map((v, i) => {
        if (v.source === "upload" && v.fileUrl) {
          return (
            <figure key={i} className="rounded-xl overflow-hidden border border-hair bg-ink">
              <video
                src={v.fileUrl}
                controls
                preload="metadata"
                poster={v.thumbnail}
                className="w-full aspect-video"
              />
              {v.title && (
                <figcaption className="px-4 py-3 text-sm font-semibold text-fg bg-paper-subtle">
                  {v.title}
                </figcaption>
              )}
            </figure>
          );
        }

        const embed = toEmbedUrl(v.source, v.url);
        if (!embed) return null;

        return (
          <figure key={i} className="rounded-xl overflow-hidden border border-hair bg-ink">
            <div className="relative aspect-video">
              {v.thumbnail && (
                <Image
                  src={v.thumbnail}
                  alt={v.title || "Video thumbnail"}
                  fill
                  className="object-cover absolute inset-0 -z-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={v.thumbnail.startsWith("/api/")}
                />
              )}
              <iframe
                src={embed}
                title={v.title || `Video ${i + 1}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {v.title && (
              <figcaption className="px-4 py-3 text-sm font-semibold text-fg bg-paper-subtle">
                {v.title}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
