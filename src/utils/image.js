export function extractDriveFileId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  return match && match[1] ? match[1] : null;
}

export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return url;

  const trimmed = url.trim();

  // Automatically convert Google Drive view links to direct image CDN links
  if (trimmed.includes('drive.google.com') || trimmed.includes('googleusercontent.com')) {
    const fileId = extractDriveFileId(trimmed);
    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return trimmed;
}

export function getFallbackDriveUrl(url) {
  if (!url || typeof url !== 'string') return url;

  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  return url;
}
