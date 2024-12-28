'use client';
import Line from "@/components/Line";
import InputLine from "@/components/InputLine";
import { useState, useEffect } from "react";



export default function Home() {
  const initialHistory = [
    {
      author: "system",
      text: "Welcome ! and get ready to put your logical skills to the test and solve a murder mystery. Can you defeat Sherlock?"
    },
    {
      author: "system",
      text: "Type help for a list of commands. Use 'start <no. of suspects>' to create a mystery with that many possible suspects. Use 'interrogate \"name of suspect\" \"question\"' to ask them relevant questions about their alibis, motives, and more. And finally, use 'arrest \"suspect name\"' to lock in your guess and end the game. "
    },
    {
      author: "system",
      text: "PS: use double quotes (avoid single quotes) and Have fun!!"
    }
  ]

  const [typing, setTyping] = useState(true);
  const [userName, setUserName] = useState("user");
  const [inputValue, setInputValue] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [history, setHistory] = useState(initialHistory);
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState({});

  // Implement this function for all the possible input commands

  useEffect(() => {

    if (inputValue) {

      let i=0;
      while (inputValue[i]!=' ' && i<inputValue.length) {
        i++;
      }
      let command = inputValue.slice(0, i);
      let args = findArgs(inputValue.slice(i+1).trim());

      let newHistory = [...history];
      newHistory.push({author: userName, text: inputValue});

      switch (command) {
        
        case "clear":
           newHistory = [{author: "system", text: "Cleared."}];
            break;

        case "name":
          if (args.length == 1) {
            setUserName(args[0]);
            newHistory = newHistory.concat([{author: "system", text: "Name changed to: " + args[0]}]);
          } else {
            newHistory = newHistory.concat([{author:"system", text: "Incorrect usage."},{author: "system", text: "Usage: name <new name>"}]);
          }
          break;

        case "start":
          console.log("Game started");
          if (isGameActive){
            newHistory = newHistory.concat([{author: "system", text: "Game is already in progress."}, {author:"system", text: "Type 'exit' to exit the game."}]);
            break;
          }

          if (args.length != 1) {
            newHistory = newHistory.concat([{author: "system", text: "Incorrect usage."}, {author: "system", text: "Usage: start <no. of suspects>"}]);
            break;
          }
          
          startGame(args[0]);
          setIsGameActive(true);
          break;

        case "help":

          if (args.length == 0){
            newHistory = newHistory.concat([{author: "system", text: "Available commands: help, start, interrogate, arrest, info, exit, name, clear"}]);
          }else if (args.length == 1){
            newHistory = newHistory.concat(help(args[0]));
          }

          break;
        
        case "exit":
          newHistory.push({author: "system", text: "Exited game."});
          setIsGameActive(false);
          setSessionHistory([]);
          setGameData({});
          break;
          
        case "interrogate":
          if (!isGameActive){
            newHistory = newHistory.concat([{author: "system", text: "Game not started."}, {author: "system", text: "Type 'start' to start the game."}]);
            break;
          }

          if (args.length != 2) {
            newHistory = newHistory.concat([{author: "system", text: "Incorrect usage."}, {author: "system", text: "Usage: interrogate <suspect name> <question>"}]);
            break;
          }
          
          interrogate(args[0], args[1]);
          break;

        case "arrest":
          if(!isGameActive){
            newHistory = newHistory.concat([{author: "system", text: "Game not started."}, {author: "system", text: "Type 'start' to start the game."}]);
            break;
          }
          if(args.length != 1){
            newHistory = newHistory.concat([{author: "system", text: "Incorrect usage."}, {author: "system", text: "Usage: arrest <suspect name> "}]);
            break;
          }

          arrest(args[0]);
          break;
          
        case "info":
          if(!isGameActive){
            newHistory = newHistory.concat([{author: "system", text: "Game not started."}, {author: "system", text: "Type 'start' to start the game."}]);
            break;
          }

          info();
          return;
          
        default:
          newHistory = newHistory.concat([{author: "system", text: "Command not found. Type \'help\' for a list of available commands."}]);
          break;
        }
    
      console.log([...newHistory]);
      setHistory(newHistory);
      // setHistory([...history, {author: userName, text: inputValue}]);
      setInputValue("");
    }
  }, [inputValue]);


  function findArgs(text, args=[]){
    text = text.trim();
    if (text.search('\"')!=-1) {
      let firstIndex = text.search('\"');
      let secondIndex = firstIndex + 1 + text.slice(firstIndex+1).search('\"');
      let arg1 = text.slice(firstIndex+1, secondIndex);
      let rest = text.slice(0,firstIndex).trim() + ' ' + text.slice(secondIndex+1).trim();
      return findArgs(rest, [...args, arg1]);
    }else{
      if (text == ''){
        return args;
      }
      return[...args, ...text.split(' ')];
    }
  }

  async function startGame(suspects){
    setLoading(true);
    const response = await fetch('/api/genai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({function:'start', suspects: suspects})
    }).then(response => response.json());
    setLoading(false);


    const gameStartText = response.text.split('\n');

    const gameStartTextElements = gameStartText.map((line, index) => {
      switch (index) {
        case 0:
          return {author: "system", text: line, color: "white"};
        case 2:
          return {author: "system", text: line, color: "red"};
        default:    
          return ({author: "system", text: line, color: "yellow"});
      }
    });

    setHistory([...history, {author:userName, text:inputValue} ,...gameStartTextElements]);

    setGameData(gameStartTextElements);
    
    setSessionHistory(
      [
        {role: "user",
          parts : [
            {text : `create a modern and unique murder mystery scenario with 1 victim and ${suspects} viable suspects. \nThis will be a game of detective where i, the user will ask you to assume a character and then question you. You have to try not to reveal the culprit in those question but give subtle hints.\nGive me a setup scene and short info about the victim and suspects each in its own paragraph. separate the info about suspects with a new line.`}
          ]
        },
        {role: "model",
          parts : [
            {text : response.text}
          ]
        }
      ]
    );
  }

  async function interrogate(suspect, question){
    setLoading(true);
    const response = await fetch('/api/genai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({function:'interrogate', suspect: suspect, question: question, history:sessionHistory})
    }).then(response => response.json());
    setLoading(false);


    setHistory([...history, {author:userName, text:inputValue}, {author: "system", text: response.text, history:sessionHistory}]);
    setSessionHistory(
      [...sessionHistory,
        {role: "user",
          parts : [
            {text : `Assume the character of ${suspect} and answer to the question with straight to point answer: \"${question}\". answer in a single paragraph. If there exists no such person in the story, respond by saying that.`}
          ]
        },
        {role: "model",
          parts : [
            {text : response.text}
          ]
        }
      ]
    )
  }

  async function arrest(suspect){
    setLoading(true);
    const response = await fetch('/api/genai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({function:'arrest', suspect: suspect, history:sessionHistory})
    }).then(response => response.json());
    setLoading(false);

    setHistory([...history, {author:userName, text:inputValue}, {author: "system", text: response.text}, {author:"system", text: "Game ended."}]);

    setSessionHistory(
      [...sessionHistory,
        {role: "user",
          parts : [
            {text : `I have made up my mind the killer is ${suspect}. Check if it is correct. Reveal the killer. And a small explanation in the next line also include how he was to be caught.`}
          ]
        },
        {role: "model",
          parts : [
            {text : response.text}
          ]
        },
      ]
    );

    setIsGameActive(false);
    setSessionHistory([]);

  }

  function info(){
    setHistory([...history, {author:userName, text:inputValue} , ...gameData]);
  }
  
  function help(command){
    switch (command) {
      case "start":
        return [{author: "system", text: "Start a game with a given number of suspects."}, {author: "system", text: "Usage: start <no. of suspects>"}];
      case "interrogate":
        return [{author: "system", text: "Ask a question to a suspect."}, {author: "system", text: "Usage: interrogate \"suspect name\" \"question\""}];
      case "arrest":
        return [{author: "system", text: "Arrest a suspect when you are absolutely sure. This ends the game."}, {author: "system", text: "Usage: arrest \"suspect name\""}];
      case "info": 
        return [{author: "system", text: "Get the information about the current game."}, {author: "system", text: "Usage: info"}];
      case "exit":
        return [{author: "system", text: "Exit the current game without making an arrest and revealing the killer."}, {author: "system", text: "Usage: exit"}];
      case "name":
        return [{author: "system", text: "Change your name."}, {author: "system", text: "Usage: name \"new name\""}];
      case "clear": 
        return [{author: "system", text: "Clear the chat."}, {author: "system", text: "Usage: clear"}];
      default :
        return [{author: "system", text: "Command not found."}, {author: "system", text: "Type 'help' for a list of available commands."}];
    }
  }


  //---------------------------------------------------------------

  let historyElements = history.map((line, index) => {
    return (
      <Line key={history.length*10000 + index} author={line.author} setTyping={setTyping} renderAnimation={false} color={line.color}>
        {line.text}
      </Line>
    );
  });

  historyElements[historyElements.length - 1] = (
    <Line key={history.length*10000 + historyElements.length-1} author={history[history.length - 1].author} setTyping={setTyping} renderAnimation={history[history.length-1].author=='system'&true} color={history[history.length - 1].color} >
      {history[history.length - 1].text}
    </Line>
  );   


  return (
    <>

      {historyElements}
      
      {
        loading? 
        <Line author={"system"} setTyping={setTyping} renderAnimation={true}>
          ...................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
        </Line> : null
      }

      <InputLine key={history.length} author={userName} className={typing ? "hidden" : ""} setInputValue={setInputValue}/>

    </>
  )
}

