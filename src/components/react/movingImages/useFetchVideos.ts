import { useCallback, useEffect, useState } from 'react';
import { type Video } from '../UI/types';

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

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

export default function useFetchVideos(isActive?: boolean) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        isActive: typeof isActive === 'boolean' ? String(isActive) : '',
      }).toString();

      const response = await fetch(`${API_BASE}/api/Video?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch videos');

      const data = await response.json();
      setVideos(Array.isArray(data) ? data.map(mapVideo) : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch videos';
      setError(message);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  }, [isActive]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, setVideos, loading, error, refetch: fetchVideos };
}
