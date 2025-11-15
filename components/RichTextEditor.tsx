"use client";

import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
  const editorRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert HTML to markdown for storage
  const convertHtmlToMarkdown = (html: string): string => {
    if (!html) return "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let markdown = "";

    const processNode = (node: Node): string => {
      let result = "";

      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();
        
        // Process children first
        const children = Array.from(element.childNodes)
          .map((child) => processNode(child))
          .join("");

        switch (tagName) {
          case "p":
            if (children.trim()) {
              result += children + "\n\n";
            }
            break;
          case "h1":
            result += "# " + children + "\n\n";
            break;
          case "h2":
            result += "## " + children + "\n\n";
            break;
          case "h3":
            result += "### " + children + "\n\n";
            break;
          case "h4":
            result += "#### " + children + "\n\n";
            break;
          case "h5":
            result += "##### " + children + "\n\n";
            break;
          case "h6":
            result += "###### " + children + "\n\n";
            break;
          case "strong":
          case "b":
            // Wrap children in ** for bold
            result += "**" + children + "**";
            break;
          case "em":
          case "i":
            // Wrap children in * for italic
            result += "*" + children + "*";
            break;
          case "u":
            result += "<u>" + children + "</u>";
            break;
          case "ul":
            result +=
              Array.from(element.children)
                .map((li) => "- " + processNode(li))
                .join("\n") + "\n\n";
            break;
          case "ol":
            result +=
              Array.from(element.children)
                .map((li, idx) => `${idx + 1}. ` + processNode(li))
                .join("\n") + "\n\n";
            break;
          case "li":
            return children;
          case "br":
            return "\n";
          case "blockquote":
            result += "> " + children + "\n\n";
            break;
          case "code":
            if (element.parentElement?.tagName.toLowerCase() === "pre") {
              return children;
            }
            result += "`" + children + "`";
            break;
          case "pre":
            result += "```\n" + children + "\n```\n\n";
            break;
          case "span":
            // Handle spans with formatting
            const fontWeight = element.style.fontWeight;
            const fontStyle = element.style.fontStyle;
            const spanIsBold = fontWeight === "700" || fontWeight === "bold";
            const spanIsItalic = fontStyle === "italic";
            if (spanIsBold && spanIsItalic) {
              result += "***" + children + "***";
            } else if (spanIsBold) {
              result += "**" + children + "**";
            } else if (spanIsItalic) {
              result += "*" + children + "*";
            } else {
              result += children;
            }
            break;
          default:
            result += children;
        }
      }

      return result;
    };

    // Clean up Google Docs specific attributes
    const cleanNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        // Remove Google Docs specific attributes but keep style for formatting
        element.removeAttribute("class");
        element.removeAttribute("id");
        element.removeAttribute("dir");
        element.removeAttribute("data-");
        Array.from(element.attributes).forEach((attr) => {
          const attrName = attr.name.toLowerCase();
          if (
            !["href", "src", "alt", "style"].includes(attrName) &&
            !attrName.startsWith("data-")
          ) {
            element.removeAttribute(attr.name);
          }
        });
        Array.from(element.childNodes).forEach(cleanNode);
      }
    };

    Array.from(tempDiv.childNodes).forEach(cleanNode);
    markdown = Array.from(tempDiv.childNodes)
      .map(processNode)
      .join("")
      .trim();

    return markdown;
  };

  // Convert markdown to HTML for editor
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return "";

    let html = markdown;

    // Convert markdown headers (must be done first, before paragraphs)
    html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
    html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
    html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Convert bold and italic - must do bold+italic first, then bold, then italic
    // Use a more specific regex that doesn't match across newlines
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    
    // Convert italic - but not if it's part of bold
    // Match *text* but not **text** or ***text***
    html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>");

    // Convert code blocks
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Convert inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Convert lists
    html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, "<ol>$1</ol>");

    // Convert blockquotes
    html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

    // Convert paragraphs (split by double newlines)
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs
      .map((p) => {
        p = p.trim();
        if (!p) return "";
        // Don't wrap if it's already a block element
        if (
          p.startsWith("<h") ||
          p.startsWith("<ul") ||
          p.startsWith("<ol") ||
          p.startsWith("<pre") ||
          p.startsWith("<blockquote") ||
          p.startsWith("<li")
        ) {
          return p;
        }
        return "<p>" + p.replace(/\n/g, "<br>") + "</p>";
      })
      .join("");

    return html;
  };

  const handleChange = (_event: any, editor: any) => {
    const data = editor.getData();
    const markdown = convertHtmlToMarkdown(data);
    onChange(markdown);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <CKEditor
        editor={ClassicEditor}
        data={convertMarkdownToHtml(value)}
        onChange={handleChange}
        config={{
          placeholder: placeholder,
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "code",
            "codeBlock",
            "|",
            "link",
            "|",
            "undo",
            "redo",
          ],
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
              { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
              { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
            ],
          },
        }}
        onReady={(editor) => {
          // Disable browser spell check
          const editable = editor.editing.view.domElement;
          if (editable) {
            editable.setAttribute("spellcheck", "false");
            editable.setAttribute("data-gramm", "false");
            editable.setAttribute("data-gramm_editor", "false");
            editable.setAttribute("data-enable-grammarly", "false");
          }
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ck-editor {
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .rich-text-editor .ck-editor__editable {
          min-height: 400px;
          background-color: #1f2937 !important;
          color: #f3f4f6 !important;
          border-color: #374151;
        }
        .rich-text-editor .ck-editor__editable.ck-focused {
          border-color: #60a5fa;
          box-shadow: 0 0 0 1px #60a5fa;
        }
        .rich-text-editor .ck-editor__editable p,
        .rich-text-editor .ck-editor__editable h1,
        .rich-text-editor .ck-editor__editable h2,
        .rich-text-editor .ck-editor__editable h3,
        .rich-text-editor .ck-editor__editable h4,
        .rich-text-editor .ck-editor__editable h5,
        .rich-text-editor .ck-editor__editable h6,
        .rich-text-editor .ck-editor__editable li,
        .rich-text-editor .ck-editor__editable blockquote,
        .rich-text-editor .ck-editor__editable code {
          color: #f3f4f6 !important;
        }
        /* Disable spell check underlines */
        .rich-text-editor .ck-editor__editable,
        .rich-text-editor .ck-editor__editable * {
          spellcheck: false !important;
        }
        .rich-text-editor .ck-editor__editable [data-gramm],
        .rich-text-editor .ck-editor__editable [data-gramm_editor],
        .rich-text-editor .ck-editor__editable [data-enable-grammarly] {
          display: none !important;
        }
        /* Remove Grammarly and other spell check overlays */
        .rich-text-editor [data-gramm="false"],
        .rich-text-editor [data-gramm_editor="false"],
        .rich-text-editor [data-enable-grammarly="false"] {
          display: block !important;
        }
        .rich-text-editor .ck-toolbar {
          background-color: #1f2937;
          border-color: #374151;
        }
        .rich-text-editor .ck-toolbar__separator {
          background-color: #374151;
        }
        .rich-text-editor .ck-button {
          color: #9ca3af;
        }
        .rich-text-editor .ck-button:hover:not(.ck-disabled) {
          background-color: #374151;
          color: #f3f4f6;
        }
        .rich-text-editor .ck-button.ck-on {
          background-color: #374151;
          color: #60a5fa;
        }
        .rich-text-editor .ck-dropdown__panel {
          background-color: #1f2937;
          border-color: #374151;
        }
        .rich-text-editor .ck-list__item {
          color: #9ca3af;
        }
        .rich-text-editor .ck-list__item:hover {
          background-color: #374151;
          color: #f3f4f6;
        }
        .rich-text-editor .ck-list__item.ck-on {
          background-color: #374151;
          color: #60a5fa;
        }
        .rich-text-editor .ck-input {
          background-color: #111827;
          color: #f3f4f6;
          border-color: #374151;
        }
        .rich-text-editor .ck-input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 1px #60a5fa;
        }
        .rich-text-editor .ck-placeholder::before {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
