import React from "react";
import { Draggable } from 'react-drag-reorder';
import "./Display.css";
import Line from "./Line";
import text from "../text/text.json";

interface IProps {};
interface IState {
    lineCount: number;
    Count: number;
    sendWord: Array<[]>;
    line: string;
};

class Display extends React.Component<IProps, IState> {

    constructor(Props: IProps) {
        super(Props);
        this.state = {
            lineCount: 0,
            Count: 0,
            sendWord : [],
            line: "",
        };
        let word = [];
    }

  lines () {
     return  this.splitString(
          text.body,
          20
      );
  }

  splitString(str: any, l: any) {
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


    sendOffWord(word:any) {
        const url = "https://jsonplaceholder.typecode.com/";
       console.log(word);
    }


  callback(line:any) {


           const count = this.callback2();

              this.setState(prevState => ({
                  sendWord: [...prevState.sendWord, line]
              }), () => {
                 if (count === this.state.lineCount) {
                      this.setState({sendWord: [...this.state.sendWord.slice(this.state.lineCount, this.state.lineCount * 2)]}, () => {
                          this.sendOffWord(this.state.sendWord);
                      })
                  }
              });




  };

callback2 = (function(limit) {
        let count = 0;
       return function() {
             count ++;
            if(count === limit){
                count = 0;
                return limit;
            }
            return count;
        };
    })(this.lines().length);

    componentDidMount(): void {
        this.setState({ lineCount: this.lines().length });
        this.setState({ sendWord: this.lines() });
    };

  render() {
    return (
      <div className="">
          <p>{this.state.sendWord}</p>
      <br/>
        <Draggable>
        {this.lines().map((line, index) => (
          <Line line={line} index={index} callback2={this.callback2.bind(this)} callback={this.callback.bind(this)}/>
        ))}
        </Draggable>
      </div>
    );
  }
}

export default Display;
