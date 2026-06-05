import { useEffect, useRef, useState } from 'react';
import useFetchImages from './useFetchImages';

type PointerPosition = {
  x: number;
  y: number;
};

type StackImageProps = {
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

function StackImage({
  id,
  imageUrl,
  alt,
  className,
  baseTransform,
  baseZIndex,
  pointer,
  isHovered,
  onHoverStart,
}: StackImageProps) {
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
      className={`absolute h-40 w-40 md:h-52 md:w-52 cursor-pointer object-cover transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: `${baseTransform} translate(${offset.x}px, ${offset.y}px) scale(${isHovered ? 1.09 : 1})`,
        zIndex: isHovered ? 90 : baseZIndex,
      }}
      onMouseEnter={() => onHoverStart(id)}
    />
  );
}

export default function LatestImageStack() {
  const { images: latestImages, loading } = useFetchImages(undefined, undefined, undefined, undefined, 'date', false, 5);
  const [pointer, setPointer] = useState<PointerPosition | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  if (loading) {
    return null
  }

  if (latestImages.length === 0) {
    return null
  }

  const centerImage = latestImages[0];
  const leftImage = latestImages[1];
  const rightImage = latestImages[2];
  const rightTopImage = latestImages[3];
  const rightBottomImage = latestImages[4];

  return (
    <div
      className="relative h-[22rem] w-[20rem] md:h-[28rem] md:w-[24rem] flex items-center justify-center px-4"
      onMouseMove={(event) => setPointer({ x: event.clientX, y: event.clientY })}
      onMouseLeave={() => {
        setPointer(null);
        setActiveImageId(null);
      }}
    >
    

      {leftImage ? (
        <StackImage
          id="left"
          imageUrl={leftImage.url}
          alt={leftImage.fileName}
          className="top-0 opacity-100"
          baseTransform="translate(-58%, 8%)"
          baseZIndex={30}
          pointer={pointer}
          isHovered={activeImageId === 'left'}
          onHoverStart={setActiveImageId}
        />
      ) : null}

      {rightImage ? (
        <StackImage
          id="right"
          imageUrl={rightImage.url}
          alt={rightImage.fileName}
          className="top-0 opacity-100"
          baseTransform="translate(12%, 42%)"
          baseZIndex={30}
          pointer={pointer}
          isHovered={activeImageId === 'right'}
          onHoverStart={setActiveImageId}
        />
      ) : null}

      {rightTopImage ? (
        <StackImage
          id="right-top"
          imageUrl={rightTopImage.url}
          alt={rightTopImage.fileName}
          className="top-0 opacity-100"
          baseTransform="translate(54%, 10%)"
          baseZIndex={25}
          pointer={pointer}
          isHovered={activeImageId === 'right-top'}
          onHoverStart={setActiveImageId}
        />
      ) : null}

      {rightBottomImage ? (
        <StackImage
          id="right-bottom"
          imageUrl={rightBottomImage.url}
          alt={rightBottomImage.fileName}
          className="top-0 opacity-100"
          baseTransform="translate(70%, 70%)"
          baseZIndex={20}
          pointer={pointer}
          isHovered={activeImageId === 'right-bottom'}
          onHoverStart={setActiveImageId}
        />
      ) : null}

      <StackImage
        id="center"
        imageUrl={centerImage.url}
        alt={centerImage.fileName}
        className="top-[32%]"
        baseTransform="translate(-38%, 20%)"
        baseZIndex={40}
        pointer={pointer}
        isHovered={activeImageId === 'center'}
        onHoverStart={setActiveImageId}
      />
    </div>
  );
}