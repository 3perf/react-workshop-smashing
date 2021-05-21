import CodeMirror from "codemirror";
import "codemirror/mode/gfm/gfm";
import "codemirror/lib/codemirror.css";
import { Component, createRef } from "react";
import "./index.css";

class NoteEditor extends Component {
  popupRef = createRef();
  textareaRef = createRef();
  state = {
    popupHeight: 0,
    isCodeEditorFocused: false,
  };

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.textareaRef.current, {
      mode: "gfm",
      lineWrapping: true,
    });

    this.editor.on("change", () => {
      this.props.saveNote(this.editor.getValue());
    });
    this.editor.setSize("100%", "300px");

    this.setState({
      popupHeight: this.popupRef.current?.clientHeight,
    });

    this.editor.on("focus", () => {
      this.setState({ isCodeEditorFocused: true });
    });
    this.editor.on("blur", () => {
      this.setState({ isCodeEditorFocused: false });
    });
  }

  componentDidUpdate() {
    const actualPopupHeight = this.popupRef.current?.clientHeight;
    if (this.state.popupHeight !== actualPopupHeight) {
      this.setState({
        popupHeight: this.popupRef.current?.clientHeight,
      });
    }
  }

  render() {
    const text = this.props.notes[this.props.activeNoteId].text;

    return (
      <div className="note-editor">
        <div className="note-editor__wrapper">
          <div
            className="note-editor__popup"
            ref={this.popupRef}
            style={{
              bottom: -this.state.popupHeight,
              visibility: this.state.isCodeEditorFocused ? "visible" : "hidden",
              pointerEvents: this.state.isCodeEditorFocused ? "auto" : "none",
            }}
          >
            <div>{text.length} characters</div>
            {text.length > 280 && (
              <div className="note-editor__popup-hint">
                <em>Hint:</em> That’s longer than a tweet!
              </div>
            )}
          </div>

          <textarea
            className="note-editor__textarea"
            ref={this.textareaRef}
            defaultValue={text}
          />
        </div>
        <div className="note-editor__hint">
          <p>This editor supports markdown! Here’s a short how-to:</p>
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
  }
}

export default NoteEditor;
