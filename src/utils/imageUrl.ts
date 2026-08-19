/**
 * Converts a Google Drive sharing URL into an image URL that an <img> element
 * can load. Other URLs are returned unchanged.
 *
 * The Drive file must be shared with "Anyone with the link" (Viewer).
 */
export const getDisplayImageUrl = (imageUrl: string): string => {
  const value = imageUrl.trim();

  if (!value) {
    return value;
  }

  try {
    const url = new URL(value);
    const isGoogleDrive = url.hostname === 'drive.google.com' || url.hostname === 'www.drive.google.com';

    if (!isGoogleDrive) {
      return value;
    }

    const fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
      ?? url.searchParams.get('id');

    return fileId
      ? `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=view`
      : value;
  } catch {
    return value;
  }
};
