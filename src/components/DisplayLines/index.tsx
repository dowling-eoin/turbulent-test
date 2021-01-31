import React from "react";
import { Draggable } from "react-drag-reorder";
import "./index.css";
import debounce from "lodash/debounce";
import Line from "./Line";
import text from "../../text/text.json";
import turbulent from "../../turbulent.svg";
import logo from "../../logo.svg";

interface IProps {}
interface IState {
  lineCount: number;
  sendString: Array<string>;
  loading: boolean;
}

class DisplayLines extends React.Component<IProps, IState> {
  static splitString(
    string: any,
    limit: number,
    allowBreaks: boolean,
    wordWrap: boolean
  ) {
    const lines = [];
    let remainingString = string;

    while (remainingString.length > limit) {
      // Each line ends at the first space found before the length limit
      let lineEnd = remainingString.substr(0, limit).lastIndexOf(" ");

      // If we don't want to cut off any words, line ends at the first space after the limit
      if (allowBreaks === false) {
        lineEnd = lineEnd <= 0 ? remainingString.indexOf(" ") : lineEnd;
      }

      // If the line contains no space - make the index of the end of the line the same as line limit
      lineEnd = lineEnd <= 0 ? limit : lineEnd;

      // Add line to lines array
      lines.push(remainingString.substr(0, lineEnd));

      // Get the position of the start of the remaining string
      let stringStart = remainingString.indexOf(" ", lineEnd) + 1;

      // EDGE CASES:
      // What if There are no spaces in the next line?
      // OR
      // There are no more spaces after the line in the rest of the text?
      // OR
      // We want the words to wrap onto the next line?
      if (
        stringStart > lineEnd + limit ||
        stringStart < lineEnd ||
        wordWrap === true
      ) {
        stringStart = lineEnd;
      }
      // Remove line from remaining string
      remainingString = remainingString.substr(stringStart);
    }
    // Add the last line
    lines.push(remainingString);
    return lines;
  }

  static lines() {
    return DisplayLines.splitString(text.body, 80, true, false);
  }

  // This is a simple closure function to count how many times updateLine fires
  countLineUpdates = ((limit: number) => {
    let count = 0;
    return () => {
      count += 1;
      if (count === limit) {
        count = 0;
        return limit;
      }
      return count;
    };
  })(DisplayLines.lines().length);

  constructor(Props: IProps) {
    super(Props);
    this.state = {
      lineCount: 0,
      sendString: [],
      loading: false,
    };
  }

  componentDidMount(): void {
    this.setState({ lineCount: DisplayLines.lines().length });
    this.setState({ sendString: DisplayLines.lines() });
  }

  updateLines(line: string) {
    // Count how many times the lines update - on final update we will make our API call
    const count = this.countLineUpdates();
    const { sendString, lineCount } = this.state;

    this.setState(
      (prevState) => ({
        sendString: [...prevState.sendString, line],
      }),
      () => {
        // If all of the lines have finished updating we will send the new word order
        if (count === lineCount) {
          // Remove previous word and add new word order to state
          this.setState(
            {
              sendString: [...sendString.slice(lineCount, lineCount * 2)],
            },
            () => {
              // Send new word order to API
              this.sendLinesToAPI(sendString);
            }
          );
        }
      }
    );
  }

  sendLinesToAPI(word: Array<string>) {
    this.setState({ loading: true });
    const context = this;
    const url = "https://jsonplaceholder.typicode.com/posts/";
    const payload = word.join(" ");

    return debounce(() => {
      (async () => {
        await fetch(url, {
          method: "POST",
          body: JSON.stringify({ body: payload }),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
          .then((response) => {
            console.log(response);
            context.setState({ loading: false });
          })
          .catch((rejected) => {
            console.log(rejected);
            context.setState({ loading: false });
          });
      })();
    }, 2000)();
  }

  render() {
    const { loading, sendString } = this.state;
    return (
      <div>
        {loading ? (
          <img src={turbulent} className="Loading-Icon" alt="loading icon" />
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => this.sendLinesToAPI(sendString)}
            onKeyDown={() => this.sendLinesToAPI(sendString)}
          >
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        )}
        <div id="display-lines">
          <Draggable>
            {DisplayLines.lines().map((line) => (
              <Line
                key={line}
                className={Line}
                line={line}
                updateLines={() => this.updateLines.bind(this)}
              />
            ))}
          </Draggable>
        </div>
      </div>
    );
  }
}

export default DisplayLines;
