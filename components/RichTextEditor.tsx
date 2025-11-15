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
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link"],
          ["clean"],
        ],
        clipboard: {
          matchVisual: false,
        },
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
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

    // Handle paste from Google Docs
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any) => {
      // Clean up Google Docs specific attributes
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        element.removeAttribute("style");
        element.removeAttribute("class");
        element.removeAttribute("id");
        element.removeAttribute("dir");
        element.removeAttribute("data-");
        
        Array.from(element.attributes).forEach((attr) => {
          const attrName = attr.name.toLowerCase();
          if (
            !["href", "src", "alt"].includes(attrName) &&
            !attrName.startsWith("data-")
          ) {
            element.removeAttribute(attr.name);
          }
        });
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
      `}</style>
    </div>
  );
}
