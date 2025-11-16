"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog content here...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link"],
          ["clean"],
        ],
        clipboard: {
          matchVisual: true,
        },
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "align",
        "list",
        "bullet",
        "blockquote",
        "code-block",
        "link",
      ],
    });

    quillRef.current = quill;

    // Set initial content
    if (value) {
      quill.root.innerHTML = value;
    }

    // Handle text changes
    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      onChange(html);
    });

    // Helper function to find text-align from element or its parents
    const getTextAlign = (element: HTMLElement): string | null => {
      let current: HTMLElement | null = element;
      while (current) {
        // Check inline style
        if (current.style && current.style.textAlign) {
          const align = current.style.textAlign.toLowerCase();
          if (["left", "center", "right", "justify"].includes(align)) {
            return align;
          }
        }
        
        // Check style attribute
        const styleAttr = current.getAttribute("style");
        if (styleAttr) {
          const match = styleAttr.match(/text-align\s*:\s*([^;]+)/i);
          if (match && match[1]) {
            const align = match[1].trim().toLowerCase();
            if (["left", "center", "right", "justify"].includes(align)) {
              return align;
            }
          }
        }
        
        current = current.parentElement;
      }
      return null;
    };

    // Handle paste to preserve alignment and formatting from Google Docs and other sources
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const textAlign = getTextAlign(element);
        
        // Apply alignment to delta operations
        if (textAlign && delta.ops && Array.isArray(delta.ops)) {
          delta.ops = delta.ops.map((op: any) => {
            if (op.insert) {
              // Handle text inserts - apply alignment as block format
              if (typeof op.insert === "string") {
                // Apply alignment to non-empty text or line breaks
                if (op.insert.trim().length > 0 || op.insert === "\n") {
                  if (!op.attributes) {
                    op.attributes = {};
                  }
                  op.attributes.align = textAlign;
                }
              }
              // Handle block-level inserts
              else if (op.insert && typeof op.insert === "object") {
                if (!op.attributes) {
                  op.attributes = {};
                }
                op.attributes.align = textAlign;
              }
            }
            return op;
          });
        }
        
        // Clean up unwanted attributes but preserve text-align in style if needed
        const styleAttr = element.getAttribute("style");
        if (styleAttr) {
          // Keep only text-align in style attribute
          const styles = styleAttr.split(";").map(s => s.trim()).filter(s => s);
          const textAlignStyle = styles.find(s => s.toLowerCase().startsWith("text-align"));
          
          if (textAlignStyle && textAlign) {
            element.setAttribute("style", textAlignStyle);
          } else {
            element.removeAttribute("style");
          }
        }
        
        // Remove other unwanted attributes
        element.removeAttribute("class");
        element.removeAttribute("id");
        if (element.tagName.toLowerCase() !== "a" && element.tagName.toLowerCase() !== "img") {
          element.removeAttribute("dir");
        }
        
        // Clean up data attributes except Quill's own
        Array.from(element.attributes).forEach((attr) => {
          const attrName = attr.name.toLowerCase();
          if (
            attrName.startsWith("data-") &&
            !attrName.startsWith("data-quill") &&
            attrName !== "data-align"
          ) {
            element.removeAttribute(attr.name);
          }
        });
      }
      return delta;
    });

    // Also match text nodes that might be inside aligned elements
    quill.clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: any) => {
      if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
        const textAlign = getTextAlign(node.parentElement);
        if (textAlign && delta.ops && Array.isArray(delta.ops)) {
          delta.ops = delta.ops.map((op: any) => {
            if (op.insert && typeof op.insert === "string" && op.insert.trim().length > 0) {
              if (!op.attributes) {
                op.attributes = {};
              }
              op.attributes.align = textAlign;
            }
            return op;
          });
        }
      }
      return delta;
    });

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [mounted, placeholder]);

  // Update editor when value changes externally
  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillRef.current.root.innerHTML = value || "";
      }
    }
  }, [value]);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <div ref={editorRef} />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-size: 16px;
          font-family: inherit;
          min-height: 400px;
          background-color: #1f2937;
          border-color: #374151;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-editor {
          min-height: 400px;
          background-color: #1f2937;
          color: #f3f4f6;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-editor .ql-toolbar {
          background-color: #1f2937;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-bottom: 1px solid #374151;
          border-color: #374151;
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #9ca3af;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #9ca3af;
        }
        .rich-text-editor .ql-toolbar .ql-picker-label {
          color: #9ca3af;
        }
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #60a5fa;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #60a5fa;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #60a5fa;
        }
        .rich-text-editor .ql-toolbar .ql-picker-item:hover {
          background-color: #374151;
          color: #f3f4f6;
        }
        .rich-text-editor .ql-toolbar .ql-picker-item.ql-selected {
          background-color: #374151;
          color: #60a5fa;
        }
        .rich-text-editor .ql-snow .ql-picker {
          color: #9ca3af;
        }
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: #9ca3af;
        }
        .rich-text-editor .ql-snow .ql-fill {
          fill: #9ca3af;
        }
        .rich-text-editor .ql-editor strong,
        .rich-text-editor .ql-editor b {
          font-weight: 700;
          color: #ffffff;
        }
        .rich-text-editor .ql-editor u {
          text-decoration: underline;
        }
        .rich-text-editor .ql-editor s,
        .rich-text-editor .ql-editor strike {
          text-decoration: line-through;
        }
        .rich-text-editor .ql-editor .ql-align-center,
        .rich-text-editor .ql-editor p.ql-align-center,
        .rich-text-editor .ql-editor div.ql-align-center {
          text-align: center;
        }
        .rich-text-editor .ql-editor .ql-align-right,
        .rich-text-editor .ql-editor p.ql-align-right,
        .rich-text-editor .ql-editor div.ql-align-right {
          text-align: right;
        }
        .rich-text-editor .ql-editor .ql-align-justify,
        .rich-text-editor .ql-editor p.ql-align-justify,
        .rich-text-editor .ql-editor div.ql-align-justify {
          text-align: justify;
        }
        .rich-text-editor .ql-editor p[style*="text-align: center"],
        .rich-text-editor .ql-editor div[style*="text-align: center"],
        .rich-text-editor .ql-editor [style*="text-align: center"] {
          text-align: center !important;
        }
        .rich-text-editor .ql-editor p[style*="text-align: right"],
        .rich-text-editor .ql-editor div[style*="text-align: right"],
        .rich-text-editor .ql-editor [style*="text-align: right"] {
          text-align: right !important;
        }
        .rich-text-editor .ql-editor p[style*="text-align: justify"],
        .rich-text-editor .ql-editor div[style*="text-align: justify"],
        .rich-text-editor .ql-editor [style*="text-align: justify"] {
          text-align: justify !important;
        }
      `}</style>
    </div>
  );
}
