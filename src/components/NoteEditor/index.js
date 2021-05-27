import {
  ButtonGroup,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import { parseISO, formatISO } from "date-fns";
import { memo, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "./index.css";

function EditingHint() {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Markdown how-to</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
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
      </AccordionDetails>
    </Accordion>
  );
}

function Toolbar({ date, onDateChange }) {
  return (
    <div className="note-editor__toolbar-inner">
      <ButtonGroup>
        <Button>Bold</Button>
        <Button>Italic</Button>
        <Button>Link</Button>
        <Button>H1</Button>
        <Button>H2</Button>
        <Button>H3</Button>
        <Button>Separator</Button>
      </ButtonGroup>
      <TextField
        classes={{ root: "note-editor__datetime" }}
        type="date"
        label="Created on"
        value={formatISO(date).split("T")[0]}
        onChange={(e) => onDateChange(parseISO(e.target.value))}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="note-editor__theme-switcher">
      <span className="note-editor__theme-switcher-label">Theme:</span>
      <ToggleButtonGroup
        size="small"
        value={theme}
        exclusive
        onChange={(_e, value) => setTheme(value)}
        aria-label="text alignment"
      >
        <ToggleButton value="light">
          <WbSunnyIcon />
        </ToggleButton>
        <ToggleButton value="dark">
          <Brightness2Icon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

const ThemeSwitcherMemo = memo(ThemeSwitcher);

function NoteEditor({ notes, activeNoteId, saveNote }) {
  const currentNote = notes[activeNoteId];

  return (
    <div className="note-editor">
      <div className="note-editor__toolbar">
        <Toolbar
          date={currentNote.date}
          onDateChange={(date) => saveNote({ date })}
        />
      </div>
      <div className="note-editor__wrapper">
        <TextField
          classes={{ root: "note-editor__textarea" }}
          multiline
          value={currentNote.text}
          onChange={(event) => saveNote({ text: event.target.value })}
          variant="outlined"
        />
      </div>
      <div className="note-editor__hint">
        <EditingHint />
      </div>
      <div>
        <ThemeSwitcherMemo />
      </div>
    </div>
  );
}

export default NoteEditor;
