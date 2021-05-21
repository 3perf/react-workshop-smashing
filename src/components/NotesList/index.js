import "./index.css";
import ReactMarkdown from "react-markdown";
import { useMemo, useRef, useState } from "react";
import gfm from "remark-gfm";
import { format } from "date-fns";

function generateNoteHeader(text) {
  const firstLine = text
    .split("\n")
    .map((i) => i.trim())
    .filter((i) => i.length > 0)[0];

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      disallowedElements={["p", "h1", "h2", "h3", "h4", "h5", "h6"]}
      unwrapDisallowed={true}
    >
      {firstLine}
    </ReactMarkdown>
  );
}

const NoteButton = ({ isActive, onNoteActivated, text, date }) => {
  const className = [
    "notes-list__button",
    "notes-list__note",
    isActive && "notes-list__note_active",
  ]
    .filter((i) => i !== false)
    .join(" ");

  return (
    <button className={className} onClick={onNoteActivated}>
      {useMemo(
        () => (
          <>
            <span className="notes-list__note-meta">
              {format(date, "d MMM yyyy HH:mm:ss")}
            </span>
            {generateNoteHeader(text)}
          </>
        ),
        [text, date]
      )}
    </button>
  );
};

export default function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  const [filter, setFilter] = useState("");
  const notesListRef = useRef();

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <input
          className="notes-list__input"
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={`Filter ${Object.keys(notes).length} note${
            Object.keys(notes).length === 1 ? "" : "s"
          }`}
        />
      </div>

      <div className="notes-list__notes" ref={notesListRef}>
        {Object.values(notes)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .filter(({ text }) => {
            if (!filter) {
              return true;
            }

            return text.toLowerCase().includes(filter.toLowerCase());
          })
          .map(({ id, text, date }) => (
            <NoteButton
              key={id}
              isActive={activeNoteId === id}
              onNoteActivated={() => onNoteActivated(id)}
              text={text}
              date={date}
            />
          ))}
      </div>

      <div className="notes-list__controls">
        <button
          className="notes-list__button notes-list__control"
          onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}
        >
          + Note
        </button>

        <button
          className="notes-list__button notes-list__control"
          onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1000 })}
        >
          + Huge note
        </button>

        <button
          className="notes-list__button notes-list__control"
          onClick={() => onNewNotesRequested({ count: 100, paragraphs: 1 })}
        >
          + 100 notes
        </button>
        <button
          className="notes-list__button notes-list__control notes-list__control_danger"
          onClick={() => onDeleteAllRequested()}
        >
          Delete all
        </button>
      </div>
    </div>
  );
}
