import React from "react";
import logo from "./logo.svg";
import "./App.css";
import DisplayLines from "./components/DisplayLines";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <DisplayLines />
      </header>
    </div>
  );
}

export default App;
