import { useState } from 'react';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import SubmitButton from '../UI/SubmitButton';
import Dropdown, { type DropdownOptions } from '../UI/Dropdown';
import { VideoSourceType } from '../UI/types';

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

const sourceOptions: DropdownOptions<VideoSourceType>[] = [
  { key: VideoSourceType.YouTube, text: 'YouTube' },
  { key: VideoSourceType.Vimeo, text: 'Vimeo' },
  { key: VideoSourceType.Other, text: 'Other' },
];

const parseDuration = (value: string) => {
  const match = value.trim().match(/^(\d+):(\d{1,2})$/);
  if (!match) return null;

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds > 59) return null;
  return minutes * 60 + seconds;
};

export default function AddVideoWindow() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [durationInput, setDurationInput] = useState('03:00');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState<VideoSourceType>(VideoSourceType.YouTube);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setThumbnailUrl('');
    setDurationInput('03:00');
    setReleaseDate(new Date().toISOString().slice(0, 10));
    setSource(VideoSourceType.YouTube);
    setError(null);
  };

  const handleCreateVideo = async () => {
    const duration = parseDuration(durationInput);
    if (!title.trim() || !description.trim() || !videoUrl.trim() || !releaseDate || duration === null) {
      setError('Please fill all required fields. Duration must be MM:SS.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/Video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          duration,
          url: videoUrl.trim(),
          thumbnailUrl: thumbnailUrl.trim() || null,
          source,
          releaseDate: new Date(releaseDate).toISOString(),
          metadata: null,
          isActive: true,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      resetForm();
      setShowModal(false);

      if (window.location.pathname === '/MovingImages') {
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        Add Video
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Add Video</h3>

          <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input placeholder="Video URL" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} />
          <Input
            placeholder="Thumbnail URL (optional)"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
          />
          <Input
            placeholder="Duration (MM:SS)"
            value={durationInput}
            onChange={(event) => setDurationInput(event.target.value)}
          />

          <label className="flex flex-col gap-2 text-sm font-semibold uppercase text-[var(--text-muted)]">
            Release Date
            <input
              type="date"
              className="p-5 text-black bg-neutral-100"
              value={releaseDate}
              onChange={(event) => setReleaseDate(event.target.value)}
            />
          </label>

          <Dropdown label="Source" value={source} onChange={setSource} options={sourceOptions} />

          <textarea
            className="w-full p-5 text-black bg-neutral-100"
            rows={4}
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <SubmitButton disabled={isSubmitting} onClick={handleCreateVideo}>
              {isSubmitting ? 'Creating...' : 'Create Video'}
            </SubmitButton>
            <button
              type="button"
              className="px-4 py-2 transition hover:bg-[var(--panel-hover)]"
              onClick={() => {
                resetForm();
                setShowModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
