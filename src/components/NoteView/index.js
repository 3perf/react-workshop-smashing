import { Button, Popover } from "@material-ui/core";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/gfm/gfm";
import { useContext, useMemo, useState } from "react";
import { SketchPicker } from "react-color";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import fakeApi from "../../utils/fakeApi";
import { ThemeContext } from "../ThemeContext";
import "./index.css";

function MarkAsRead() {
  const [readStatus, setReadStatus] = useState("unread");

  return (
    <>
      <Button
        variant="outlined"
        disabled={readStatus === "loading"}
        onClick={() => {
          setReadStatus("loading");
          fakeApi
            .changeReadStatus()
            .then(() =>
              setReadStatus((isRead) => (isRead === "read" ? "unread" : "read"))
            );
        }}
      >
        {readStatus === "unread" && "Mark as read"}
        {readStatus === "read" && "Mark as unread"}
        {readStatus === "loading" && "Loading..."}
      </Button>
    </>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="note-view__theme-switcher">
      <span className="note-view__theme-switcher-label">Theme:</span>
      <ToggleButtonGroup
        size="small"
        value={theme}
        exclusive
        onChange={(_e, value) => setTheme(value)}
        aria-label="text alignment"
      >
        <ToggleButton value="light">
          <WbSunnyIcon size="small" />
        </ToggleButton>
        <ToggleButton value="dark">
          <Brightness2Icon size="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

function ColorPicker({ color, onColorChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverVisible = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Change Header Color
      </Button>
      <Popover
        open={isPopoverVisible}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SketchPicker
          color={color}
          onChangeComplete={(color) => onColorChange(color.hex)}
        />
      </Popover>
    </>
  );
}

function CommentField() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverVisible = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Add a Comment
      </Button>
      <Popover
        open={isPopoverVisible}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="note-view__comment-wrapper">
          <div className="note-view__textarea-wrapper">
            <textarea
              ref={(el) => {
                if (el) {
                  const editor = CodeMirror.fromTextArea(el, {
                    mode: "gfm",
                    lineWrapping: true,
                  });
                  editor.setSize("300px", "100px");
                }
              }}
              defaultValue=""
            />
          </div>
          <Button
            variant="outlined"
            onClick={() => alert("Ha! Gotcha. Can’t save this.")}
          >
            Save
          </Button>
        </div>
      </Popover>
    </>
  );
}

export default function NoteView({ text }) {
  const [headerColor, setHeaderColor] = useState("#000");

  return (
    <div className="note-view">
      <div className="note-view__control">
        <MarkAsRead />
        <ThemeSwitcher />
        <ColorPicker color={headerColor} onColorChange={setHeaderColor} />
        <CommentField />
      </div>
      <section
        className="note-view__view"
        style={{ "--header-color": headerColor }}
      >
        {useMemo(
          () => (
            <ReactMarkdown remarkPlugins={[gfm]}>{text}</ReactMarkdown>
          ),
          [text]
        )}
      </section>
    </div>
  );
}
