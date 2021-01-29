import React from "react";
import { Draggable } from 'react-drag-reorder';
import "./Display.css";
import Line from "./Line";
import text from "../text/text.json";
import _, {debounce} from 'lodash';

interface IProps {};
interface IState {
    lineCount: number;
    sendString: Array<[]>;
    line: string;
};

class Display extends React.Component<IProps, IState> {

    constructor(Props: IProps) {
        super(Props);
        this.state = {
            lineCount: 0,
            sendString : [],
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

  splitString(string: any, length: any) {
    const lines = [];
    let remainingString = string;
    while (remainingString.length > length) {

      let lineEnd = remainingString.substr(0, length).lastIndexOf(" ");
        //If lineEnd is less than 0, lineEnd = max line length
      lineEnd = lineEnd <= 0 ? length : lineEnd;
//Add line to lines array
              lines.push(remainingString.substr(0, lineEnd));
//Get position of start of remaining string
      let stringStart = remainingString.indexOf(" ", lineEnd) + 1;

      if ((stringStart < lineEnd) || (stringStart > (lineEnd + length))) {
          stringStart = lineEnd;
      }
      //Remove line from remaining string
      remainingString = remainingString.substr(stringStart);

    }

    lines.push(remainingString);
    return lines;
  };


    sendOffWord(word:any) {
        const url = "https://jsonplaceholder.typicode.com/posts/";

       let payload = word.join(' ');
        (debounce(function() {

        (async () => {
            const rawResponse = await fetch(url,
                {
                    method: "POST",
                    body: JSON.stringify({body: payload}),
                    headers:
                        {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                }).then((response) =>
            {
                console.log(response);
            }).catch(rejected => {
                console.log(rejected);
            });
        })();

        }, 2000))();

    }


  updateLines(line:any) {


           const count = this.countLineUpdates();

              this.setState(prevState => ({
                  sendString: [...prevState.sendString, line]
              }), () => {
                 if (count === this.state.lineCount) {
                      this.setState({sendString: [...this.state.sendString.slice(this.state.lineCount, this.state.lineCount * 2)]}, () => {
                          this.sendOffWord(this.state.sendString);
                      })
                  }
              });




  };

countLineUpdates = (function(limit) {
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
        this.setState({ sendString: this.lines() });
    };

  render() {
    return (
      <div className="">
          <p>{this.state.sendString}</p>
      <br/>
        <Draggable>
        {this.lines().map((line, index) => (
          <Line line={line} index={index} updateLines={this.updateLines.bind(this)}/>
        ))}
        </Draggable>
      </div>
    );
  }
}

export default Display;
