import { useEffect, useMemo, useState } from 'react';
import Loading from '../UI/Loading';
import { type Video } from '../UI/types';

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

const sourceLabel: Record<number, string> = {
  0: 'YouTube',
  1: 'Vimeo',
  2: 'Other',
};

const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const mapVideo = (raw: any): Video => ({
  id: Number(raw.id ?? raw.Id),
  title: raw.title ?? raw.Title ?? '',
  description: raw.description ?? raw.Description ?? '',
  duration: Number(raw.duration ?? raw.Duration ?? 0),
  url: raw.url ?? raw.Url ?? '',
  thumbnailUrl: raw.thumbnailUrl ?? raw.ThumbnailUrl ?? null,
  source: Number(raw.source ?? raw.Source ?? 0),
  releaseDate: raw.releaseDate ?? raw.ReleaseDate ?? new Date().toISOString(),
  metadata: raw.metadata ?? raw.Metadata ?? null,
  isActive: Boolean(raw.isActive ?? raw.IsActive ?? true),
});

const buildVideoEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('youtu.be') || host.includes('youtube.com')) {
      let videoId = '';

      if (host.includes('youtu.be')) {
        videoId = parsed.pathname.replace('/', '');
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? '';
      } else if (parsed.pathname.startsWith('/watch')) {
        videoId = parsed.searchParams.get('v') ?? '';
      } else if (parsed.pathname.includes('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? '';
      }

      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&playsinline=1`;
    }

    if (host.includes('vimeo.com')) {
      const segments = parsed.pathname.split('/').filter(Boolean);
      const videoId = segments[segments.length - 1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
};

export default function VideoDetailPage({ id }: { id: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/Video/${id}`);

        if (response.status === 404) {
          setError('Video not found.');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to load video.');
        }

        const raw = await response.json();
        setVideo(mapVideo(raw));
      } catch {
        setError('Failed to load video.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const embedUrl = useMemo(() => (video ? buildVideoEmbedUrl(video.url) : null), [video]);

  if (loading) {
    return <Loading />;
  }

  if (!video) {
    return (
      <section>
        <a href="/MovingImages" className="back-link">Back</a>
        <h1>{error ?? 'Video not found.'}</h1>
      </section>
    );
  }

  return (
    <section className="video-detail">
      <div className="detail-header">
        <a href="/MovingImages" className="back-link">Back</a>
        <h1 className="video-title">{video.title}</h1>
      </div>

      <div className="player-wrap">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <a href={video.url} target="_blank" rel="noreferrer" className="external-link">
            Open Video
          </a>
        )}
      </div>
{/* 
      <div className="info-grid">
        <div><strong>ID:</strong> {video.id}</div>
        <div><strong>Source:</strong> {sourceLabel[video.source] ?? 'Unknown'}</div>
        <div><strong>Release Date:</strong> {new Date(video.releaseDate).toLocaleDateString()}</div>
        <div><strong>Duration:</strong> {formatDuration(video.duration)}</div>
        <div><strong>Active:</strong> {video.isActive ? 'Yes' : 'No'}</div>
        <div><strong>URL:</strong> <a href={video.url} target="_blank" rel="noreferrer">{video.url}</a></div>
      </div> */}
{/* 
      <article className="description">
        <h2>Description</h2>
        <p>{video.description}</p>
      </article> */}

      {video.metadata && (
        <article className="metadata">
          <h2>Metadata</h2>
          <pre>{video.metadata}</pre>
        </article>
      )}
      <br />
    </section>
  );
}
