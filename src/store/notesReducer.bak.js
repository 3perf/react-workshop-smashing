import { createAction } from "@reduxjs/toolkit";

export const putNote = createAction("notes/putNote", (id, { text, date }) => {
  return {
    payload: {
      id,
      text,
      date,
    },
  };
});

export const deleteAllNotes = createAction("notes/deleteAll");

const notesReducer = (notes, action) => {
  if (action.type === putNote) {
    const { id: noteId, text: noteText, date: noteDate } = action.payload;

    if (notes[noteId]) {
      // The note already exists; just update it
      return {
        ...notes[noteId],
        text: noteText || notes[noteId].text,
        date: noteDate || notes[noteId].date,
      };
      // TODO: demonstrate immer (with the “Force Save” button)
    } else {
      // The note doesn’t exist; create it, filling the creation date
      return {
        id: noteId,
        text: noteText,
        date: new Date(),
      };
    }
  }

  if (action.type === deleteAllNotes) {
    return {};
  }

  return notes;
};

export default notesReducer;
