import { useMemo, useState } from 'react';
import Dropdown from '../UI/Dropdown';
import useLogin from '../login/useLogin';
import Loading from '../UI/Loading';
import useFetchVideos from './useFetchVideos';

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const extractYouTubeVideoId = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    let videoId = '';

    if (host.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '');
    } else if (parsed.pathname.startsWith('/watch')) {
      videoId = parsed.searchParams.get('v') ?? '';
    } else if (parsed.pathname.includes('/embed/')) {
      videoId = parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? '';
    }

    return videoId || null;
  } catch {
    return null;
  }
};

const buildYouTubeThumbnailUrl = (url: string) => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};

export default function VideoGalleryViews() {
  const { isLoggedIn } = useLogin();
  const { videos, setVideos, loading, error, refetch } = useFetchVideos(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'duration'>('date');
  const [ascending, setAscending] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      if (sortBy === 'date') {
        return ascending
          ? new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
          : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }

      return ascending ? a.duration - b.duration : b.duration - a.duration;
    });
  }, [videos, sortBy, ascending]);

  const handleDeleteVideo = async (id: number) => {
    const confirmed = window.confirm('Delete this video? This cannot be undone.');
    if (!confirmed) return;

    setActionError(null);

    try {
      const response = await fetch(`${API_BASE}/api/Video/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setVideos((previous) => previous.filter((video) => video.id !== id));
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete video');
    }
  };

  const navigateToVideo = (id: number) => {
    window.location.href = `/MovingImages/${id}`;
  };

  const renderVideoMedia = (video: { title: string; thumbnailUrl?: string | null; url: string }, className: string) => {
    if (video.thumbnailUrl) {
      return (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`${className} w-full object-cover`}
          loading="lazy"
        />
      );
    }

    const generatedThumbnail = buildYouTubeThumbnailUrl(video.url);
    if (generatedThumbnail) {
      return (
        <img
          src={generatedThumbnail}
          alt={video.title}
          className={`${className} w-full object-cover`}
          loading="lazy"
        />
      );
    }

    return (
      <img
        src="/placeholder.jpg"
        alt={video.title}
        className={`${className} w-full object-cover`}
        loading="lazy"
      />
    );
  };

  return (
    <section className="py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4   pb-4">
        <Dropdown
          label="Sort"
          value={sortBy}
          onLabelClick={() => setAscending(!ascending)}
          onRenderIcon={() => <span>{ascending ? '↑' : '↓'}</span>}
          onChange={setSortBy}
          options={[
            { key: 'date', text: 'DATE' },
            { key: 'duration', text: 'DURATION' },
          ]}
        />

        <div className="inline-flex gap-4 rounded-md p-1">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            title="List view"
            className={`p-2 transition ${
              viewMode === 'list'
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--panel-hover)] hover:text-[var(--text)]'
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1" />
              <circle cx="4" cy="12" r="1" />
              <circle cx="4" cy="18" r="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            title="Grid view"
            className={`p-2 transition ${
              viewMode === 'grid'
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--panel-hover)] hover:text-[var(--text)]'
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {(loading || isLoggedIn === null) && <Loading />}

      {(error || actionError) && (
        <p className="mb-4 text-sm text-red-500">{actionError ?? error}</p>
      )}

      {!loading && !sortedVideos.length && !error && (
        <p className="text-[var(--text-muted)]">No videos yet.</p>
      )}

      {viewMode === 'list' ? (
        <div className="space-y-5">
          {sortedVideos.map((video) => (
            <article
              key={String(video.id)}
              className="grid cursor-pointer gap-4 border border-[var(--border)] bg-[var(--panel)] p-3 transition hover:bg-[var(--panel-hover)] md:grid-cols-[300px_minmax(0,1fr)]"
              onClick={() => navigateToVideo(video.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigateToVideo(video.id);
                }
              }}
              tabIndex={0}
              role="button"
            >
              {renderVideoMedia(video, 'h-44 md:h-40')}

              <div className="flex flex-col justify-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {new Date(video.releaseDate).getFullYear()} • {formatDuration(video.duration)}
                </p>
                <h2 className="text-xl font-semibold">{video.title}</h2>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{video.description}</p>
                {isLoggedIn && (
                  <button
                    type="button"
                    className="w-fit text-sm text-red-500 hover:text-red-400"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteVideo(video.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedVideos.map((video) => (
            <article
              key={String(video.id)}
              className="group relative cursor-pointer overflow-hidden border border-[var(--border)] bg-[var(--panel)]"
              onClick={() => navigateToVideo(video.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigateToVideo(video.id);
                }
              }}
              tabIndex={0}
              role="button"
            >
              {renderVideoMedia(video, 'h-56 transition-transform duration-100 group-hover:scale-[1.01]')}

              <div className="absolute inset-0 bg-black/0 transition-colors duration-100 group-hover:bg-black/35" />

              <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/75 to-black/0 p-4 text-white transition-transform duration-100 group-hover:translate-y-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  {new Date(video.releaseDate).toLocaleDateString()} • {formatDuration(video.duration)}
                </p>
                <h2 className="mt-1 text-base font-semibold">{video.title}</h2>
              </div>

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteVideo(video.id);
                  }}
                  className="absolute right-2 top-2 bg-black/60 px-2 py-1 text-xs font-semibold text-white opacity-80 transition hover:opacity-100"
                >
                  Delete
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
