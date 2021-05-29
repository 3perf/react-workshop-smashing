import { Button, Popover } from "@material-ui/core";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import "codemirror/lib/codemirror.css";
import { useContext, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import fakeApi from "../../utils/fakeApi";
import { ThemeContext } from "../ThemeContext";
import "./index.css";

function importCodeMirror() {
  return Promise.all([
    import(/* webpackChunkName: "codemirror" */ "codemirror"),
    import(
      /* webpackChunkName: "codemirror", webpackPrefetch: true */ "codemirror/mode/gfm/gfm"
    ),
  ]).then(([codemirror]) => codemirror);
}

// function importColorPicket() {
//   return import(/* webpackMode: "eager" */ "react-color");
// }

// React.lazy()
// loadable-component

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

  const { SketchPicker } = require("react-color");

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
  console.time("call 1");
  const [anchorEl, setAnchorEl] = useState(null);
  console.timeEnd("call 1");

  console.time("call 2");
  const isPopoverVisible = Boolean(anchorEl);
  console.timeEnd("call 2");

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
              ref={async (el) => {
                if (el) {
                  const CodeMirror = await importCodeMirror();
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
            // if (element.props.dangerouslySetInnerHTML.__html) {
            //   div.innerHTML = ''
            // }
            // <div
            //       dangerouslySetInnerHTML={{ __html: "" }}
            //       suppressHydrationWarning={true}
            // >
            <ReactMarkdown remarkPlugins={[gfm]}>{text}</ReactMarkdown>
            // </div>
          ),
          [text]
        )}
      </section>
    </div>
  );
}
