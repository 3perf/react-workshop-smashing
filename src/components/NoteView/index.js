import "./index.css";
import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export default function NoteView({ text }) {
  const [fontSize, setFontSize] = useState("regular");

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
        style={{ fontSize: fontSize === "regular" ? null : fontSize }}
      >
        {useMemo(
          () => (
            <ReactMarkdown remarkPlugins={[gfm]}>{text}</ReactMarkdown>
          ),
          [text]
        )}
      </section>
    </div>
  );
}
