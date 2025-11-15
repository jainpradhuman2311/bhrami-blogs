import React from "react";

/**
 * Parse markdown text and convert to React elements
 * Supports **bold** and *italic* formatting
 */
export function parseMarkdown(text: string, keyPrefix: string = ""): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  
  // Match bold (**text**)
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  const matches: Array<{ type: 'bold' | 'italic'; start: number; end: number; content: string }> = [];
  
  while ((match = boldRegex.exec(text)) !== null) {
    matches.push({
      type: 'bold',
      start: match.index,
      end: match.index + match[0].length,
      content: match[1]
    });
  }
  
  // Match italic (*text* but not **text**)
  const italicRegex = /(?<!\*)\*([^*]+?)\*(?!\*)/g;
  while ((match = italicRegex.exec(text)) !== null) {
    // Check if it's not part of a bold match
    const isPartOfBold = matches.some(m => 
      match.index >= m.start && match.index < m.end
    );
    if (!isPartOfBold) {
      matches.push({
        type: 'italic',
        start: match.index,
        end: match.index + match[0].length,
        content: match[1]
      });
    }
  }
  
  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);
  
  // Build parts array
  matches.forEach((m, idx) => {
    // Add text before match
    if (m.start > lastIndex) {
      parts.push(text.substring(lastIndex, m.start));
    }
    
    // Add formatted text
    if (m.type === 'bold') {
      parts.push(<strong key={`${keyPrefix}-bold-${idx}`} className="font-bold">{m.content}</strong>);
    } else {
      parts.push(<em key={`${keyPrefix}-italic-${idx}`} className="italic">{m.content}</em>);
    }
    
    lastIndex = m.end;
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [text];
}

