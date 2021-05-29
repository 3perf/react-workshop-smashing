import "./index.css";
import { StrictMode, useMemo, useState } from "react";
import { Avatar } from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { Provider } from "react-redux";
import NotesList from "../NotesList";
import NoteView from "../NoteView";
import { useSelector } from "react-redux";
import { ThemeContextProvider } from "../ThemeContext";
import { getNotes } from "../../utils/storage";
import store from "../../store";
import { useEffect } from "react";
import fakeApi from "../../utils/fakeApi";
import { browser } from "../../utils/userAgent";
import UAParser from "ua-parser-js";

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

function AppPrimaryPane({ activeNoteId, notes }) {
  return (
    <div className="notes__column notes__column_primary">
      <div className="notes__column-header-row">
        <h1 className="notes__column-header">Article</h1>
        <Authors />
      </div>
      <div className="notes__column-content">
        <NoteView text={notes[activeNoteId].text} />
      </div>
    </div>
  );
}

function App() {
  const notes = getNotes();

  const [activeNoteId, setActiveNoteId] = useState(
    Object.values(notes).sort((a, b) => b.date.getTime() - a.date.getTime())[0]
      .id
  );

  // Remove server-generated Material UI styles, per https://material-ui.com/guides/server-rendering/
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // Send data to analytics
  useEffect(() => {
    const userAgent = UAParser();
    fakeApi.logVisit({ browser: userAgent.browser });
  });

  const value = useMemo(() => {
    console.log("useMemo", window.dependency);
    return { a: window.dependency };
  }, [window.dependency]);

  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeContextProvider>
          <div className="notes">
            <div className="notes__column notes__column_list">
              <h1 className="notes__column-header">ArticleList</h1>
              <div className="notes__column-content">
                <NotesList
                  notes={notes}
                  activeNoteId={activeNoteId}
                  onNoteActivated={setActiveNoteId}
                />
              </div>
            </div>
            <AppPrimaryPane activeNoteId={activeNoteId} notes={notes} />
          </div>
        </ThemeContextProvider>
      </Provider>
    </StrictMode>
  );
}

export default App;
