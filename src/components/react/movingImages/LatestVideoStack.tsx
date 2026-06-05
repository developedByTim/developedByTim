import { useEffect, useRef, useState } from 'react';
import useFetchVideos from './useFetchVideos';

type PointerPosition = {
  x: number;
  y: number;
};

type StackVideoProps = {
  id: string;
  imageUrl: string;
  alt: string;
  className: string;
  baseTransform: string;
  baseZIndex: number;
  pointer: PointerPosition | null;
  isHovered: boolean;
  onHoverStart: (id: string) => void;
};

const extractYouTubeVideoId = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null;
    }

    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
    }

    if (parsed.pathname.startsWith('/watch')) {
      return parsed.searchParams.get('v');
    }

    if (parsed.pathname.includes('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
};

const getVideoPreviewImage = (thumbnailUrl: string | null | undefined, videoUrl: string) => {
  if (thumbnailUrl) return thumbnailUrl;

  const youtubeId = extractYouTubeVideoId(videoUrl);
  if (youtubeId) {
    return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  return '/placeholder.jpg';
};

function StackVideo({
  id,
  imageUrl,
  alt,
  className,
  baseTransform,
  baseZIndex,
  pointer,
  isHovered,
  onHoverStart,
}: StackVideoProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!pointer || !imageRef.current) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const vectorX = centerX - pointer.x;
    const vectorY = centerY - pointer.y;
    const distance = Math.hypot(vectorX, vectorY) || 1;
    const maxDistance = 340;
    const force = Math.max(0, (maxDistance - distance) / maxDistance);
    const moveStrength = isHovered ? 20 : 12;

    setOffset({
      x: (vectorX / distance) * force * moveStrength,
      y: (vectorY / distance) * force * moveStrength,
    });
  }, [pointer, isHovered]);

  return (
    <img
      ref={imageRef}
      src={imageUrl}
      alt={alt}
      className={`absolute h-52 w-52 cursor-pointer object-cover transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: `${baseTransform} translate(${offset.x}px, ${offset.y}px) scale(${isHovered ? 1.09 : 1})`,
        zIndex: isHovered ? 90 : baseZIndex,
      }}
      onMouseEnter={() => onHoverStart(id)}
    />
  );
}

export default function LatestVideoStack() {
  const { videos, loading } = useFetchVideos(true);
  const [pointer, setPointer] = useState<PointerPosition | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  const latestVideos = [...videos]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 3);

  if (loading || latestVideos.length === 0) {
    return null;
  }

  const centerVideo = latestVideos[0];
  const leftVideo = latestVideos[1];
  const rightVideo = latestVideos[2];

  return (
    <div
      className="relative h-[28rem] w-[24rem] flex items-center justify-center px-4"
      onMouseMove={(event) => setPointer({ x: event.clientX, y: event.clientY })}
      onMouseLeave={() => {
        setPointer(null);
        setActiveImageId(null);
      }}
    >
      {leftVideo ? (
        <StackVideo
          id="left"
          imageUrl={getVideoPreviewImage(leftVideo.thumbnailUrl, leftVideo.url)}
          alt={leftVideo.title}
          className="top-0 opacity-100"
          baseTransform="translate(-40%, 8%)"
          baseZIndex={30}
          pointer={pointer}
          isHovered={activeImageId === 'left'}
          onHoverStart={setActiveImageId}
        />
      ) : null}

      {rightVideo ? (
        <StackVideo
          id="right"
          imageUrl={getVideoPreviewImage(rightVideo.thumbnailUrl, rightVideo.url)}
          alt={rightVideo.title}
          className="top-0 opacity-100"
          baseTransform="translate(30%, 42%)"
          baseZIndex={30}
          pointer={pointer}
          isHovered={activeImageId === 'right'}
          onHoverStart={setActiveImageId}
        />
      ) : null}

      <StackVideo
        id="center"
        imageUrl={getVideoPreviewImage(centerVideo.thumbnailUrl, centerVideo.url)}
        alt={centerVideo.title}
        className="top-[32%]"
        baseTransform="translate(-20%, 20%)"
        baseZIndex={40}
        pointer={pointer}
        isHovered={activeImageId === 'center'}
        onHoverStart={setActiveImageId}
      />
    </div>
  );
}
