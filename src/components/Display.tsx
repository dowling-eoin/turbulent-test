import React from "react";
import "./Display.css";
import Line from "./Line";

class Display extends React.Component {
  teest = () =>
    this.splitter(
      "This is a string with several characters.120 to be precise I want to split it into substrings of length twenty or less.",
      20
    );

  splitter = function splitter(str: any, l: any) {
    const strs = [];
    let string = str;
    while (string.length > l) {
      let pos = string.substring(0, l).lastIndexOf(" ");
      pos = pos <= 0 ? l : pos;
      strs.push(string.substring(0, pos));
      let i = string.indexOf(" ", pos) + 1;
      if (i < pos || i > pos + l) i = pos;
      string = string.substring(i);
    }
    strs.push(string);
    return strs;
  };

  render() {
    return (
      <div className="">
        {this.teest().map((line) => (
          <Line line={line} />
        ))}
      </div>
    );
  }
}

export default Display;
