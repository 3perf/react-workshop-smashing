import { Component, createRef } from "react";
import "./index.css";

class NoteEditor extends Component {
  popupRef = createRef();
  state = {
    popupHeight: 0,
    isCodeEditorFocused: false,
  };

  componentDidMount() {
    this.setState({
      popupHeight: this.popupRef.current.clientHeight,
    });
  }

  componentDidUpdate() {
    const actualPopupHeight = this.popupRef.current.clientHeight;
    if (this.state.popupHeight !== actualPopupHeight) {
      this.setState({
        popupHeight: actualPopupHeight,
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
            value={text}
            onChange={(event) => this.props.saveNote(event.target.value)}
            onFocus={() => {
              this.setState({ isCodeEditorFocused: true });
            }}
            onBlur={() => {
              this.setState({ isCodeEditorFocused: false });
            }}
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
