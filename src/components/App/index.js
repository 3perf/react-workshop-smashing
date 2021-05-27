import "./index.css";
import { useState } from "react";
import { Avatar, Tab, Tabs } from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import NotesList from "../NotesList";
import NoteEditor from "../NoteEditor";
import NoteView from "../NoteView";
import { nanoid } from "nanoid";
import Jabber from "jabber";
import { deleteNotes, getNotes, putNote } from "../../utils/storage";
import { useDispatch, useSelector } from "react-redux";
import { updateLastActiveDate } from "../../store/userReducer";
import { formatISO } from "date-fns/esm";
import { ThemeContextProvider } from "../ThemeContext";

const jabber = new Jabber();

function ModeSwitcher({ mode, onModeSwitch }) {
  const modesWithIndices = ["edit", "view"];

  return (
    <Tabs
      value={modesWithIndices.indexOf(mode)}
      classes={{ indicator: "notes__active-tab" }}
      onChange={(_event, newIndex) => {
        onModeSwitch(modesWithIndices[newIndex]);
      }}
    >
      <Tab label="Edit" />
      <Tab label="View" />
    </Tabs>
  );
}

function Authors() {
  const activeIn2021 = useSelector((state) =>
    state.users.filter((i) => i.lastActiveDate.includes("2021"))
  );

  return (
    <div className="notes__authors">
      <div className="notes__authors-last-active">
        {activeIn2021.length} authors active this year
      </div>
      <AvatarGroup max={4}>
        <Avatar src="/avatar1.jpg" />
        <Avatar src="/avatar2.jpg" />
        <Avatar src="/avatar3.jpg" />
        <Avatar src="/avatar4.jpg" />
        <Avatar src="/avatar5.jpg" />
      </AvatarGroup>
    </div>
  );
}

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

  return (
    <div className="notes__column notes__column_primary">
      <div className="notes__column-header-row">
        <h1 className="notes__column-header">Editor</h1>
        <Authors />
      </div>
      <div className="notes__tabs">
        <ModeSwitcher mode={mode} onModeSwitch={setMode} />
      </div>
      <div className="notes__column-content">
        {mode === "edit" && (
          <NoteEditor
            saveNote={({ text, date }) =>
              saveNote(activeNoteId, { text, date })
            }
            notes={notes}
            activeNoteId={activeNoteId}
          />
        )}
        {mode === "view" && <NoteView text={notes[activeNoteId].text} />}
      </div>
    </div>
  );
}

function App() {
  const [notes, setNotes] = useState(getNotes());

  const [activeNoteId, setActiveNoteId] = useState(null);

  const dispatch = useDispatch();

  const saveNote = (id, { text, date }) => {
    putNote(id, { text, date });

    const newNotes = getNotes();
    setNotes(newNotes);

    dispatch(updateLastActiveDate(formatISO(new Date()).split("T")[0]));
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

      putNote(noteId, { text: noteText });
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

  return (
    <ThemeContextProvider>
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
    </ThemeContextProvider>
  );
}

export default App;
