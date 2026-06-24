import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MarkdownActions } from './MarkdownActions';

interface MarkdownPreviewProps {
  markdown: string;
  filename: string;
}

export function MarkdownPreview({ markdown, filename }: MarkdownPreviewProps) {
  return (
    <div className="rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-semibold text-[var(--secondary)] ml-2">
            {filename.replace(/\.[^.]+$/, '')}.md
          </span>
        </div>
        <MarkdownActions markdown={markdown} filename={filename} />
      </div>

      {/* Preview */}
      <div className="p-5 max-h-[480px] overflow-y-auto">
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return isInline ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
