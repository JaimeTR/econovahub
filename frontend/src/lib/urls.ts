export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
}

export function getBackendUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');
}
