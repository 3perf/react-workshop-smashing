import notes from "./notes.json";
import { parseISO } from "date-fns";

const transformedNotes = Object.fromEntries(
  Object.entries(notes).map(([noteId, note]) => {
    return [
      noteId,
      {
        ...note,
        date: parseISO(note.date),
      },
    ];
  })
);

export const getNotes = () => {
  return transformedNotes;
};
