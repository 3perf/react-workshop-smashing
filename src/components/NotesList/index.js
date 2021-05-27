import "./index.css";
import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";
import gfm from "remark-gfm";
import { format } from "date-fns";
import { Button, ButtonGroup, TextField } from "@material-ui/core";

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

function FilterInput({ filter, onChange, noteCount }) {
  return (
    <TextField
      className="notes-list__input"
      type="search"
      value={filter}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Filter ${noteCount} note${noteCount === 1 ? "" : "s"}`}
    />
  );
}

function NoteButton({ isActive, onNoteActivated, text, date }) {
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
              {format(date, "d MMM yyyy")}
            </span>
            {generateNoteHeader(text)}
          </>
        ),
        [text, date]
      )}
    </button>
  );
}

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  const [filter, setFilter] = useState("");

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filter}
          onChange={setFilter}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
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
        <ButtonGroup size="small">
          <Button
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}
          >
            + Note
          </Button>
          <Button
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1000 })}
          >
            + Huge note
          </Button>
          <Button
            onClick={() => onNewNotesRequested({ count: 100, paragraphs: 1 })}
          >
            + 100 notes
          </Button>
          <Button onClick={() => onDeleteAllRequested()}>Delete all</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default NotesList;
