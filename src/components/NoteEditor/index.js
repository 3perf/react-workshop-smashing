import "./index.css";
import textReadability from "text-readability";
import * as featureFlags from "../../utils/featureFlags";
import { useEffect, useMemo, useRef } from "react";
import _ from "lodash";

const readScoreMemoized = _.memoize(textReadability.daleChallReadabilityScore);

// daleChallReadabilityScore → window.allTextsCalledWith.push(text)

// readScoreMemoized("text1"); // → invokes daleChallReadabilityScore('text1')
// readScoreMemoized("text2"); // → invokes daleChallReadabilityScore('text2')
// readScoreMemoized("text1"); // → NOT invoking daleChallReadabilityScore('text2'), returning the memoized value

function calculateReadingScore(textList) {
  const scoreSum = textList
    .map((i) => readScoreMemoized(i))
    .reduce((a, b) => a + b, 0);
  const averageScore = scoreSum / textList.length;
  return averageScore;
}

// memo = (Component) => (props) => {
//   return useMemo(() => <Component {...props} />, [...Object.values(props)]);
// };

const NoteEditor = ({ notes, activeNoteId, saveNote }) => {
  const currentNoteText = notes[activeNoteId].text;

  const currentReadingScore = useMemo(() => {
    return calculateReadingScore([currentNoteText]);
  }, [currentNoteText]);

  const noteTexts = Object.values(notes)
    .filter((note) => note.id !== activeNoteId)
    .map((i) => i.text);

  const othersReadingScore = useMemo(() => {
    return calculateReadingScore(noteTexts);
  }, [JSON.stringify(noteTexts)]);

  useWhyDidYouUpdate("NoteEditor", { currentNoteText, notes, activeNoteId });

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
