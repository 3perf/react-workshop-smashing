import { Component, createRef, useLayoutEffect } from "react";
import "./index.css";
import _ from "lodash";

class NoteEditor extends Component {
  popupRef = createRef();
  state = {
    popupHeight: 0,
    isCodeEditorFocused: false,
  };

  componentDidMount() {
    // this.setState({
    //   popupHeight: this.popupRef.current.clientHeight,
    // });
    // const observer = new ResizeObserver((arg) => { this.setState({ popupHeight: arg. }) });
    // observer.observe(this.popupRef.current)
  }

  componentDidUpdate() {
    // const actualPopupHeight = this.popupRef.current.clientHeight;
    // if (this.state.popupHeight !== actualPopupHeight) {
    //   this.setState({
    //     popupHeight: actualPopupHeight,
    //   });
    // }
    /**
     * 1) take what you’re doing with JS → reimplement it with CSS
     * 2) take what you’re doing with JS → make it run in a new frame (with requestAnimationFrame)
     * 3) ResizeObserver
     * 4) use functional components & useEffect()
     */
  }

  handleChange = (event) => {
    // cancelIdleC?allback(oldIdleCallback);
    // const callbackId = requestIdleCallback(() =>
    this.props.saveNote(event.target.value);
    // );
  };

  /*
   * 1) render: calls render() on components
   * 2) commit: applies DOM changes + useLayoutEffect, componentDidUpdate
   * [render] → [commit] → [render] → [commit] → [render] → [commit]
   * 3) “passive effect phase”: useEffect()
   */

  render() {
    const text = this.props.notes[this.props.activeNoteId].text;

    // useEffect(() => {
    //   const actualPopupHeight = this.popupRef.current.clientHeight;
    // })

    // useLayoutEffect(() => {
    //   const actualPopupHeight = this.popupRef.current.clientHeight;
    //   // → Forced style recalculation
    // })

    /**
     * _.throttle(x, 1000) : _.debounce(x, 5000)
     *    useDebounce hook / useThrottle hook from react-hook
     * requestIdleCallback(x)
     * virtualization (react-window / IntersectionObserver)
     *  → 1) react renders cheaper
     *  → 2) style recalc cheaper
     *  → 3) layout recalc cheaper
     */

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
            defaultValue={text}
            onChange={this.handleChange}
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
