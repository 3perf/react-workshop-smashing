import { configureStore } from "@reduxjs/toolkit";
// import { parseISO, formatISO } from "date-fns";
import { combineReducers } from "redux";
// import notesReducer from "./notesReducer";
import userReducer from "./userReducer";

// const loadNotesFromLocalStorage = () => {
//   const parsedNotes = JSON.parse(localStorage.reactWorkshopAppNotes || "{}");

//   const transformedNotes = Object.fromEntries(
//     Object.entries(parsedNotes).map(([id, note]) => {
//       const transformedNote = { ...note, date: parseISO(note.date) };
//       return [id, transformedNote];
//     })
//   );

//   return transformedNotes;
// };

// const saveNotesToLocalStorage = (notes) => {
//   const transformedNotes = Object.fromEntries(
//     Object.entries(notes).map(([id, note]) => {
//       const transformedNote = { ...note, date: formatISO(note.date) };
//       return [id, transformedNote];
//     })
//   );

//   const stringifiedNotes = JSON.stringify(transformedNotes);

//   localStorage.reactWorkshopAppNotes = stringifiedNotes;
// };

const store = configureStore({
  reducer: combineReducers({
    // notes: notesReducer,
    users: userReducer,
  }),
  preloadedState: {
    // notes: loadNotesFromLocalStorage(),
    users: [
      {
        id: 1,
        lastActiveDate: "2020-05-05",
      },
      {
        id: 2,
        lastActiveDate: "2021-04-01",
      },
      {
        id: 3,
        lastActiveDate: "2021-04-04",
      },
    ],
  },
});

// store.subscribe((state) => {
//   saveNotesToLocalStorage(state.notes);
// });

export default store;
