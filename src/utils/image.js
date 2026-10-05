export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return url;

  const trimmed = url.trim();

  // Automatically convert Google Drive view links to direct image CDN links
  if (trimmed.includes('drive.google.com')) {
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  return trimmed;
}
