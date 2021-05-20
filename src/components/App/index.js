import "./index.css";
import { useState } from "react";
import NotesList from "../NotesList";
import NoteEditor from "../NoteEditor";
import NoteView from "../NoteView";
import { nanoid } from "nanoid";
import Jabber from "jabber";
import { deleteNotes, getNotes, putNote } from "../../utils/storage";

const jabber = new Jabber();

function AppPrimaryPane({ activeNoteId, notes, saveNote }) {
  const [mode, setMode] = useState("edit");

  if (!activeNoteId) {
    return (
      <div className="notes__column notes__column_primary">
        <div className="notes__column-content">
          <div className="notes__empty-editor">
            <div className="notes__eyes"></div>
            <div className="notes__eyes-caption">
              Select a note to start editing
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "edit") {
    return (
      <div className="notes__column notes__column_primary">
        <h1 className="notes__column-header">
          Edit or{" "}
          <button
            className="notes__mode-button"
            onClick={() => setMode("view")}
          >
            View
          </button>
        </h1>
        <div className="notes__column-content">
          <NoteEditor
            saveNote={(text) => saveNote(activeNoteId, text)}
            notes={notes}
            activeNoteId={activeNoteId}
          />
        </div>
      </div>
    );
  }

  if (mode === "view") {
    return (
      <div className="notes__column notes__column_primary">
        <h1 className="notes__column-header">
          <button
            className="notes__mode-button"
            onClick={() => setMode("edit")}
          >
            Edit
          </button>{" "}
          or View
        </h1>
        <div className="notes__column-content">
          <NoteView text={notes[activeNoteId].text} />
        </div>
      </div>
    );
  }
}

/*

[App                         ][NoteList × 1 ms][AppPrimaryPane][Child 1 × 10 ms][Child 2 × 10 ms]
[getNotes][useState][useState]


*/

function App() {
  const [notes, setNotes] = useState(getNotes());

  const [activeNoteId, setActiveNoteId] = useState(null);

  const saveNote = (id, text) => {
    putNote(id, text);

    const newNotes = getNotes();
    setNotes(newNotes);
  };

  const createNewNotes = ({ count, paragraphs }) => {
    for (let i = 0; i < count; i++) {
      const noteId = nanoid();

      let noteText = jabber.createParagraph(6);
      for (let j = 0; j < paragraphs; j++) {
        let line = jabber.createParagraph(30);

        noteText += "\n\n" + line;
      }

      // Make random words bold or italic
      noteText = noteText
        .split("\n")
        .map((line) =>
          line
            .split(" ")
            .filter(Boolean)
            .map((word) => {
              if (Math.random() < 0.05) {
                return "**" + word + "**";
              }

              if (Math.random() < 0.05) {
                return "_" + word + "_";
              }

              return word;
            })
            .join(" ")
        )
        .join("\n");

      putNote(noteId, noteText);
    }

    const newNotes = getNotes();
    setNotes(newNotes);

    // For convenience, if only a single note was created, activate it
    if (count === 1) {
      const noteIds = Object.keys(newNotes);
      setActiveNoteId(noteIds[noteIds.length - 1]);
    }
  };

  const deleteAllNotes = () => {
    deleteNotes();

    const newNotes = getNotes();
    setNotes(newNotes);
    setActiveNoteId(null);
  };

  const children = (
    <div className="notes">
      <div className="notes__column notes__column_list">
        <h1 className="notes__column-header">NoteList</h1>
        <div className="notes__column-content">
          <NotesList
            notes={notes}
            activeNoteId={activeNoteId}
            onNoteActivated={setActiveNoteId}
            onNewNotesRequested={createNewNotes}
            onDeleteAllRequested={deleteAllNotes}
          />
        </div>
      </div>
      <AppPrimaryPane
        activeNoteId={activeNoteId}
        notes={notes}
        saveNote={saveNote}
      />
    </div>
  );

  console.log(children);

  return children;

  /*

  { }
  */
}

export default App;
