export const PLAN_LIMITS = {
  FREE: {
    maxUploadBytes: 8 * 1024 * 1024,
    quotaBytes: 8 * 1024 * 1024,
    maxCycles: Infinity,
    resetHours: 42,
  },
  PRO: {
    maxUploadBytes: 15 * 1024 * 1024,
    quotaBytes: 15 * 1024 * 1024,
    maxCycles: 10,
    resetHours: 42,
  },
} as const;

export const ALLOWED_EXTENSIONS = new Set([
  '.pdf', '.docx', '.doc', '.txt', '.rtf',
  '.pptx', '.ppt', '.xlsx', '.xls', '.csv',
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.tif',
  '.md', '.markdown', '.html', '.htm', '.zip',
]);

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/rtf',
  'application/rtf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'text/markdown',
  'text/html',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
]);

export const BLOCKED_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.ps1', '.js', '.ts', '.jsx', '.tsx',
  '.php', '.py', '.rb', '.jar', '.dll', '.msi', '.app', '.deb', '.rpm',
  '.vbs', '.scr', '.com', '.pif',
]);

export const PRO_SUBSCRIPTION_DAYS = 30;
