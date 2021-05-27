import "./index.css";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { nanoid } from "nanoid";

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
            fakeApi
              .changeReadStatus()
              .then(() => setIsRead((isRead) => !isRead));

            fakeApi
              .updateSyncStatus(lastSyncId)
              .then((syncId) => setLastSyncId(syncId));
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
