import React from "react";
import { Draggable } from 'react-drag-reorder';
import "./index.css";
import Line from "./Line";
import text from "../../text/text.json";
import _, {debounce} from 'lodash';
import turbulent from "../../turbulent.svg";

interface IProps {};
interface IState {
    lineCount: number;
    sendString: Array<string>;
    line: string;
    loading: boolean;
};

class DisplayText extends React.Component<IProps, IState> {

    constructor(Props: IProps) {
        super(Props);
        this.state = {
            lineCount: 0,
            sendString : [],
            line: "",
            loading: false,
        };
    }

  lines () {
     return  this.splitString(
          text.body,
          80,
         false,
      );
  }

  splitString(string: any, limit: number, allowBreaks: boolean) {
    const lines = [];
    let remainingString = string;

    while (remainingString.length > limit) {
        //Each line ends at the first space found before the length limit
      let lineEnd = remainingString.substr(0, limit).lastIndexOf(" ");

      //If we don't want to cut off any words, line ends at the first space after the limit
        if(allowBreaks === false) {
            lineEnd = lineEnd <= 0 ? remainingString.indexOf(" ") : lineEnd;
        }

        //If the line contains no space - make the index of the end of the line the same as line limit
        lineEnd = lineEnd <= 0 ? limit : lineEnd;



        //Add line to lines array
              lines.push(remainingString.substr(0, lineEnd));


    //Get the position of the start of the remaining string
      let stringStart = remainingString.indexOf(" ", lineEnd) + 1;
        console.log("not "+ stringStart);
        if ((stringStart < lineEnd) || (stringStart > (lineEnd + limit))) {
            console.log("special "+ stringStart);
            stringStart = lineEnd;
        }
        //Remove line from remaining string
        remainingString = remainingString.substr(stringStart);
    }
//Add the last line
    lines.push(remainingString);
    return lines;
  };


    sendWordToAPI(word: Array<string>) {
        this.setState({loading: true});
        const url = "https://jsonplaceholder.typicode.com/posts/";

       let payload = word.join(' ');
       (debounce(function() {

          let API = async () => {
            const rawResponse = await fetch(url,
                {
                    method: "POST",
                    body: JSON.stringify({body: payload}),
                    headers:
                        {
                            "Content-Type": "application/json; charset=utf-8"
                        }
                }).then((response) =>
            {
                console.log(response);
                this.hideIcon();
            }).catch(rejected => {
                console.log(rejected);
                this.hideIcon();
            });
        };
       }, 2000))();

    }

    hideIcon() {
        this.setState({loading: false});
    }


  updateLines(line:string) {

        //Count how many times the lines update - on final update we will make our API call
           const count = this.countLineUpdates();

              this.setState(prevState => ({
                  sendString: [...prevState.sendString, line]
              }), () => {
                  //If all of the lines have finished updating we will send the new word order
                 if (count === this.state.lineCount) {
                     //Remove previous word and add new word order to state
                      this.setState({sendString: [...this.state.sendString.slice(this.state.lineCount, this.state.lineCount * 2)]}, () => {
                          //Send new word order to API
                          this.sendWordToAPI(this.state.sendString);
                      })
                  }
              });
  };

    //This is a simple closure function to count how many times updateLine fires
countLineUpdates = (function(limit: number) {
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
      <div>
          {this.state.loading && <img src={turbulent} className="Loading-Icon" alt="loading icon" />}
          <Draggable>
        {this.lines().map(line => (
          <Line key={line} className={line} line={line} updateLines={this.updateLines.bind(this)}/>
        ))}
          </Draggable>
      </div>
    );
  }
}

export default DisplayText;
