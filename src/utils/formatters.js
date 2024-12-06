import { filesize } from 'filesize';

export function formatBytes(bytes) {
  return filesize(bytes, { base: 2 });
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}