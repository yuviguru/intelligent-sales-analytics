import { clsx } from 'clsx'

interface MarkdownMessageProps {
  content: string
  isUser?: boolean
}

export function MarkdownMessage({ content, isUser = false }: MarkdownMessageProps) {
  // Parse inline formatting (bold, italic, etc.)
  const parseInlineFormatting = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []
    let key = 0

    // Parse bold text (**text**)
    const boldRegex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    let match

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      // Add bold text
      parts.push(<strong key={`bold-${key++}`} className="font-semibold text-surface-50">{match[1]}</strong>)
      lastIndex = boldRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  // Format the content for better display
  const formatContent = (text: string): JSX.Element[] => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let currentList: (string | JSX.Element)[][] = []
    let inCodeBlock = false
    let codeBlockLines: string[] = []

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
            {currentList.map((item, i) => (
              <li key={i} className="text-sm leading-relaxed">{item}</li>
            ))}
          </ul>
        )
        currentList = []
      }
    }

    const flushCodeBlock = () => {
      if (codeBlockLines.length > 0) {
        elements.push(
          <pre key={`code-${elements.length}`} className="bg-surface-950/50 rounded-lg p-3 my-2 overflow-x-auto">
            <code className="text-xs text-surface-300 font-mono">
              {codeBlockLines.join('\n')}
            </code>
          </pre>
        )
        codeBlockLines = []
      }
    }

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
          inCodeBlock = false
        } else {
          flushList()
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBlockLines.push(line)
        return
      }

      // Headers (must be checked before removing asterisks)
      if (line.startsWith('###')) {
        flushList()
        const headerText = line.replace(/^###\s*/, '')
        elements.push(
          <h4 key={index} className="font-semibold text-surface-100 mt-3 mb-1 text-sm">
            {parseInlineFormatting(headerText)}
          </h4>
        )
        return
      }
      if (line.startsWith('##')) {
        flushList()
        const headerText = line.replace(/^##\s*/, '')
        elements.push(
          <h3 key={index} className="font-semibold text-surface-50 mt-3 mb-2">
            {parseInlineFormatting(headerText)}
          </h3>
        )
        return
      }
      if (line.startsWith('#') && !line.startsWith('##')) {
        flushList()
        const headerText = line.replace(/^#\s*/, '')
        elements.push(
          <h2 key={index} className="font-bold text-surface-50 mt-3 mb-2 text-lg">
            {parseInlineFormatting(headerText)}
          </h2>
        )
        return
      }

      // Lists (bullet points and numbered)
      const bulletMatch = line.match(/^[•\-]\s+(.+)/)
      const numberedMatch = line.match(/^\d+\.\s+(.+)/)

      if (bulletMatch || numberedMatch) {
        const content = bulletMatch ? bulletMatch[1] : numberedMatch![1]
        currentList.push(parseInlineFormatting(content))
        return
      }

      // Regular paragraph
      if (line.trim()) {
        flushList()
        elements.push(
          <p key={index} className="text-sm leading-relaxed my-1">
            {parseInlineFormatting(line)}
          </p>
        )
      } else if (elements.length > 0) {
        // Empty line - add spacing
        flushList()
        elements.push(<div key={index} className="h-2" />)
      }
    })

    flushList()
    flushCodeBlock()

    return elements
  }

  return (
    <div className={clsx(
      'max-w-[85%] rounded-2xl px-4 py-3',
      isUser
        ? 'bg-accent text-surface-950'
        : 'bg-surface-800 text-surface-200'
    )}>
      {formatContent(content)}
    </div>
  )
}
