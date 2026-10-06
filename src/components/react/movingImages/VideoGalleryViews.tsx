import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';
import Dropdown from '../UI/Dropdown';
import useLogin from '../login/useLogin';
import Loading from '../UI/Loading';
import useFetchVideos from './useFetchVideos';

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;
const VIEW_MODE_STORAGE_KEY = 'moving-images-view-mode';

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

const extractVimeoVideoId = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (!host.includes('vimeo.com')) return null;

    const segments = parsed.pathname.split('/').filter(Boolean);

    for (let index = segments.length - 1; index >= 0; index -= 1) {
      const segment = segments[index];
      if (/^\d+$/.test(segment)) {
        return segment;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const buildVimeoThumbnailUrl = (url: string) => {
  const videoId = extractVimeoVideoId(url);
  if (!videoId) return null;

  return `https://vumbnail.com/${videoId}.jpg`;
};

export default function VideoGalleryViews() {
  const { isLoggedIn } = useLogin();
  const { videos, setVideos, loading, error, refetch } = useFetchVideos(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [viewModeLoaded, setViewModeLoaded] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'duration'>('date');
  const [ascending, setAscending] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const savedViewMode = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (savedViewMode === 'list' || savedViewMode === 'grid') {
      setViewMode(savedViewMode);
    }
    setViewModeLoaded(true);
  }, []);

  useEffect(() => {
    if (viewModeLoaded) {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }
  }, [viewMode, viewModeLoaded]);

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

  const updateListPreviewPosition = (event: ReactMouseEvent<HTMLElement>) => {
    const previewWidth = Math.min(480, window.innerWidth - 16);
    const previewHeight = previewWidth * 0.75;
    const fitsOnRight = event.clientX + 16 + previewWidth <= window.innerWidth - 8;
    const left = fitsOnRight
      ? event.clientX + 16
      : Math.max(8, event.clientX - previewWidth - 16);
    const top = Math.max(8, Math.min(event.clientY - previewHeight / 2, window.innerHeight - previewHeight - 8));

    event.currentTarget.style.setProperty('--preview-x', `${left}px`);
    event.currentTarget.style.setProperty('--preview-y', `${top}px`);
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

    const generatedVimeoThumbnail = buildVimeoThumbnailUrl(video.url);
    if (generatedVimeoThumbnail) {
      return (
        <img
          src={generatedVimeoThumbnail}
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
      {!loading && (
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
                  ? 'bg-[var(--panel-selected)] text-[var(--text)]'
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
                  ? 'bg-[var(--panel-selected)] text-[var(--text)]'
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
      )}

      {(loading || isLoggedIn === null) && <Loading />}

      {(error || actionError) && (
        <p className="mb-4 text-sm text-red-500">{actionError ?? error}</p>
      )}

      {!loading && !sortedVideos.length && !error && (
        <p className="text-[var(--text-muted)]">No videos yet.</p>
      )}

      {viewMode === 'list' ? (
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {sortedVideos.map((video) => (
            <article
              key={String(video.id)}
              className="group relative cursor-pointer py-4"
              onMouseMove={updateListPreviewPosition}
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
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 md:grid-cols-[minmax(0,1fr)_auto_auto]">
                <h2 className="col-span-2 min-w-0 break-words text-2xl font-semibold md:col-span-1">
                  {video.title}
                </h2>
                <span className="col-start-1 row-start-2 text-base font-semibold text-[var(--text-muted)] md:col-auto md:row-auto">
                  {formatDuration(video.duration)}
                </span>
                <span className="col-start-2 row-start-2 justify-self-end text-base font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] md:col-auto md:row-auto md:justify-self-start">
                  {new Date(video.releaseDate).getFullYear()}
                </span>
              </div>
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

              <div
                className="pointer-events-none fixed z-[5000] hidden aspect-[4/3] w-[30rem] max-w-[calc(100vw-1rem)] overflow-hidden shadow-xl transition-[left,top] duration-150 ease-out motion-reduce:transition-none group-hover:block"
                style={{
                  left: 'var(--preview-x, -9999px)',
                  top: 'var(--preview-y, -9999px)',
                }}
              >
                {renderVideoMedia(video, 'h-full')}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedVideos.map((video) => (
            <article
              key={String(video.id)}
              className="group relative cursor-pointer overflow-hidden bg-transparent"
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
              <div className="aspect-[4/3] overflow-hidden">
                {renderVideoMedia(video, 'h-full transition-transform duration-100 group-hover:scale-[1.01]')}
              </div>

              <div className="pointer-events-none absolute inset-0 hidden bg-black/0 transition-colors duration-100 md:block md:group-hover:bg-black/35" />

              <div className="p-4 text-[var(--text)] md:absolute md:bottom-0 md:left-0 md:right-0 md:translate-y-full md:bg-gradient-to-t md:from-black/75 md:to-black/0 md:text-white md:transition-transform md:duration-100 md:group-hover:translate-y-0">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] md:text-white/90">
                  {new Date(video.releaseDate).getFullYear()}
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <h2 className="min-w-0 truncate text-base font-semibold">{video.title}</h2>
                  <span className="shrink-0 text-sm font-semibold">{formatDuration(video.duration)}</span>
                </div>
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
