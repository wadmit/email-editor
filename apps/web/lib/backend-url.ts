const DEFAULT_BACKEND_URL = 'http://localhost:9261/api/v1';

function normalizeBaseUrl(url?: string) {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

export function getBackendUrl() {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL) || DEFAULT_BACKEND_URL;
}

export function buildBackendUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getBackendUrl()}${normalizedPath}`;
}
