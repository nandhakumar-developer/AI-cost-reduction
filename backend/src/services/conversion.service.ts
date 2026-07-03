import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { AppError } from '../utils/apiResponse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONVERT_SCRIPT = path.join(__dirname, '../../python/convert.py');

export async function convertWithMarkItDown(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(env.pythonPath, [CONVERT_SCRIPT, filePath], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      if (code === 0 && stdout.trim()) {
        resolve(stdout);
        return;
      }

      if (stderr.includes('ModuleNotFoundError') || stderr.includes('No module named')) {
        reject(new AppError(500, 'MarkItDown is not installed. Run: pip install markitdown'));
        return;
      }

      reject(new AppError(422, stderr.trim() || 'Conversion failed'));
    });

    proc.on('error', () => {
      reject(new AppError(500, 'Python is not available. Install Python and markitdown.'));
    });
  });
}

export function fallbackMarkdown(filename: string, content?: string): string {
  const title = filename.replace(/\.[^.]+$/, '');
  if (content?.trim()) {
    return content;
  }
  return `# ${title}\n\n> Converted from **${filename}**\n\nContent could not be extracted automatically. Please ensure Microsoft MarkItDown is installed on the server.\n`;
}
