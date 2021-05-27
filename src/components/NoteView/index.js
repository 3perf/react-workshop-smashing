import "./index.css";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { nanoid } from "nanoid";
import { unstable_batchedUpdates } from "react-dom";

const fakeApi = {
  changeReadStatus: () => new Promise((resolve) => setTimeout(resolve, 300)),
  updateSyncStatus: () =>
    new Promise((resolve) => setTimeout(() => resolve(nanoid()), 400)),
};

export default function NoteView({ text }) {
  const [isRead, setIsRead] = useState(false);
  const [lastSyncId, setLastSyncId] = useState(nanoid());

  return (
    <div className="note-view">
      <div className="note-view__control">
        <button
          onClick={() => {
            // Promise.all([
            // fakeApi.changeReadStatus(),
            fakeApi.updateSyncStatus(lastSyncId).then((_, syncId) => {
              setIsRead((isRead) => !isRead);
              setLastSyncId(syncId);
              // });
            });
          }}
        >
          {isRead ? "Mark as unread" : "Mark as read"}
        </button>{" "}
        <small>Last sync id: {lastSyncId}</small>
      </div>
      <section className="note-view__view">
        <ReactMarkdown remarkPlugins={[gfm]}>{text}</ReactMarkdown>
      </section>
    </div>
  );
}

/*
componentDidMount() { / componentDidUpdate()
  this.setState()
}

useLayoutEffect(() => {
  setSomeState()
})

useEffect(() => {
  setSomeState()
})
*/
