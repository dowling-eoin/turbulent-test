import React from "react";
import "./Display.css";

class Display extends React.Component {
  teest = () => {
    const boost = "tooooeeooooooooooooooooooost";
    return boost;
  };

  render() {
    return (
      <div className="">
        <h1>{this.teest()}</h1>
      </div>
    );
  }
}

export default Display;
