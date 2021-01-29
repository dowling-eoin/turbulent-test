import React, { useEffect } from 'react';
import "./Line.css";

function Line(props: any) {
  const { line, updateLines } = props;
  useEffect(() => {
    updateLines(line);
  });

  return <div className="Line">{line}</div>;
}

export default Line;
