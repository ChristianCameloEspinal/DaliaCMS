import { useCallback, useState } from 'react';
import type { Media, MediaMap } from '@/media/media.types';

export function useEditorMedia({
  initialLibrary,
  initialMedia,
  onSelectMedia,
}: {
  initialLibrary: Media[];
  initialMedia: MediaMap;
  onSelectMedia: (item: Media) => void;
}) {
  const [library, setLibrary] = useState<Media[]>(initialLibrary);
  const [media, setMedia] = useState<MediaMap>(initialMedia);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelectMedia = useCallback(
    (item: Media) => {
      onSelectMedia(item);
      setMedia((prev) => ({ ...prev, [item.id]: { url: item.url, alt: item.alt } }));
      setPickerOpen(false);
    },
    [onSelectMedia]
  );

  const handleUploadedMedia = useCallback((item: Media) => {
    setLibrary((prev) => [item, ...prev]);
    setMedia((prev) => ({ ...prev, [item.id]: { url: item.url, alt: item.alt } }));
  }, []);

  return {
    library,
    media,
    pickerOpen,
    setPickerOpen,
    handleSelectMedia,
    handleUploadedMedia,
  };
}
