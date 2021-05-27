import "./index.css";
import ReactMarkdown from "react-markdown";
import { memo, useMemo, useState } from "react";
import gfm from "remark-gfm";
import { format } from "date-fns";
import { Button, ButtonGroup, TextField } from "@material-ui/core";
import { useRef } from "react";
import { useEffect } from "react";

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

const FilterInput = memo(function FilterInput({ filter, onChange, noteCount }) {
  return (
    <TextField
      className="notes-list__input"
      type="search"
      value={filter}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Filter ${noteCount} note${noteCount === 1 ? "" : "s"}`}
    />
  );
});

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

function NoteControls(props) {
  useWhyDidYouUpdate("NoteControls", props);

  const { onNewNotesRequested, onDeleteAllRequested } = props;

  return (
    <ButtonGroup size="small">
      <Button onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}>
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
  );
}

const NoteControlsMemoized = memo(NoteControls);

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
      <NoteControlsMemoized
        onNewNotesRequested={onNewNotesRequested}
        onDeleteAllRequested={onDeleteAllRequested}
      />
      <div className="notes-list__controls"></div>
    </div>
  );
}

function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();
  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }
    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

export default NotesList;
