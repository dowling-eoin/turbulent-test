import React from "react";
import "./Line.css";

function Line(props: any) {
  const { line } = props;
  return <div className="Line">{line}</div>;
}

export default Line;
