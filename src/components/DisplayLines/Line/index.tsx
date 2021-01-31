import React, { useEffect } from "react";
import "./index.css";

function Index(props: any) {
  const { line, updateLines } = props;

  useEffect(() => {
    updateLines(line);
  });

  return <div className="Line">{line}</div>;
}

export default Index;
