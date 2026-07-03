import path from 'path';

export function getExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function getBaseName(filename: string): string {
  const ext = path.extname(filename);
  return filename.slice(0, -ext.length || undefined);
}

export function mdFilename(originalFilename: string): string {
  return `${getBaseName(originalFilename)}.md`;
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
