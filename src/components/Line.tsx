import React, { useEffect } from 'react';
import "./Line.css";

function Line(props: any) {
  const { line, index, callback, callback2 } = props;
  useEffect(() => {
    callback(" "+line);
   // callback2();
//trimWord();
  });

  return <div className="Line">{line}</div>;
}

export default Line;
