import "./index.css";
import textReadability from "text-readability";
import * as featureFlags from "../../utils/featureFlags";

function calculateReadingScore(textList) {
  const scoreSum = textList
    .map((i) => textReadability.daleChallReadabilityScore(i))
    .reduce((a, b) => a + b, 0);
  const averageScore = scoreSum / textList.length;
  return averageScore;
}

const NoteEditor = ({ notes, activeNoteId, saveNote }) => {
  const currentNoteText = notes[activeNoteId].text;

  const currentReadingScore = featureFlags.readingStatsEnabled
    ? calculateReadingScore([currentNoteText])
    : 0;
  const othersReadingScore = featureFlags.readingStatsEnabled
    ? calculateReadingScore(
        Object.values(notes)
          .filter((note) => note.id !== activeNoteId)
          .map((i) => i.text)
      )
    : 0;

  return (
    <div className="note-editor">
      <div className="note-editor__wrapper">
        <textarea
          className="note-editor__textarea"
          value={currentNoteText}
          onChange={(event) => saveNote(event.target.value)}
        />
      </div>
      {featureFlags.readingStatsEnabled && (
        <div className="note-editor__reading-scores">
          <strong>Reading complexity:</strong> {currentReadingScore.toFixed(2)}{" "}
          for this note
          {Object.values(notes).length > 1 && (
            <> · {othersReadingScore.toFixed(2)} on average</>
          )}{" "}
          · lower is better
        </div>
      )}
      <div className="note-editor__hint">
        <p>
          <strong>Hint:</strong> this editor supports markdown! Here’s a short
          how-to:
        </p>
        <ul>
          <li>
            <code>**bold**</code> for <b>bold</b>
          </li>
          <li>
            <code>_italic_</code> for <i>italic</i>
          </li>
          <li>
            <code>[links](https://github.com/)</code> for{" "}
            <a href="https://github.com">links</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NoteEditor;
