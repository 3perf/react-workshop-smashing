import "./index.css";
import "highlight.js/styles/github.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import hljs from "highlight.js";
import escape from "escape-html";

function CodeWithHighlighting({ children, className }) {
  const codeContent = escape(children.join("\n"));
  const codeBlock = useRef();

  useEffect(() => {
    const codeTag = codeBlock.current.childNodes[0].childNodes[0];
    hljs.highlightElement(codeTag);
  }, [codeContent, className]);

  return useMemo(
    () => (
      <div
        ref={codeBlock}
        dangerouslySetInnerHTML={{
          __html: `<pre class="${className}"><code>${codeContent}</code></pre>`,
        }}
      />
    ),
    [codeContent, className]
  );
}

const components = {
  code: ({ children, className, inline, ...props }) => {
    return inline ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <CodeWithHighlighting className={className}>
        {children}
      </CodeWithHighlighting>
    );
  },
};

export default function NoteView({ text }) {
  const [fontSize, setFontSize] = useState("regular");
  const noteView = useRef();

  return (
    <div className="note-view">
      <div className="note-view__control">
        Font size:{" "}
        {["small", "regular", "large"].map((inputFontSize) => (
          <label key={inputFontSize}>
            <input
              type="radio"
              name="fontSize"
              value={inputFontSize}
              checked={fontSize === inputFontSize}
              onChange={(event) => {
                if (event.target.checked) {
                  setFontSize(inputFontSize);
                }
              }}
            />
            {inputFontSize}
          </label>
        ))}
      </div>
      <section
        className="note-view__view"
        ref={noteView}
        style={{ fontSize: fontSize === "regular" ? null : fontSize }}
      >
        <ReactMarkdown remarkPlugins={[gfm]} components={components}>
          {text}
        </ReactMarkdown>
      </section>
    </div>
  );
}
