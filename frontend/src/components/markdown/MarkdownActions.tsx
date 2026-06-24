import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../common/Button';

interface MarkdownActionsProps {
  markdown: string;
  filename: string;
}

export function MarkdownActions({ markdown, filename }: MarkdownActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success('Markdown copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy. Please try manually.');
    }
  };

  const handleDownload = () => {
    const mdFilename = filename.replace(/\.[^.]+$/, '') + '.md';
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mdFilename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${mdFilename}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        icon={copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        onClick={handleCopy}
      >
        {copied ? 'Copied!' : 'Copy'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        icon={<Download className="w-3.5 h-3.5" />}
        onClick={handleDownload}
      >
        Download .md
      </Button>
    </div>
  );
}
