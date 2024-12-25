'use client';
import Image from "next/image";
import Line from "@/components/Line";
import InputLine from "@/components/InputLine";
import { useState, useEffect, use } from "react";


export default function Home() {
  const [typing, setTyping] = useState(true);
  const [renderAnimation, setRenderAnimation] = useState(true);
  const [userName, setUserName] = useState("Agrim");
  const [inputValue, setInputValue] = useState("");


  const [history, setHistory] = useState([{author: "system", text: "Welcome to the chat!"}, {author:"system", text: "Type something and press enter to send a message."}]);
  

  useEffect(() => {
    const enterHandler = (e) => {
      if (e.key === "Enter") {
        console.log("Enter pressed");
        
        var newHistory = [...history];
        
        newHistory.push({author: userName, text: inputValue});
        console.log(newHistory);
        setHistory(newHistory);
      }
    }
  
    window.removeEventListener('keydown', enterHandler);
    document.querySelector('.input-line-input').addEventListener("keydown", enterHandler);

    
  });

  let historyElements = history.map((line, index) => {
    return (
      <Line key={history.length*10000 + index} author={line.author} setTyping={setTyping} renderAnimation={false}>
        {line.text}
      </Line>
    );
  });

  historyElements[historyElements.length - 1] = (
    <Line key={history.length*10000 + historyElements.length-1} author={history[history.length - 1].author} setTyping={setTyping} renderAnimation={true}>
      {history[history.length - 1].text}
    </Line>
  );   

  useEffect(() => {
    let historyElements = history.map((line, index) => {
      return (
        <Line key={history.length*10000 + index} author={line.author} setTyping={setTyping} renderAnimation={false}>
          {line.text}
        </Line>
      );
    });
  
    historyElements[historyElements.length - 1] = (
      <Line key={history.length*10000 + historyElements.length-1} author={history[history.length - 1].author} setTyping={setTyping} renderAnimation={true}>
        {history[history.length - 1].text}
      </Line>
    ); 
  }, [history]);

  return (
    <>

      {historyElements}
      <InputLine author="Agrim" className={typing ? "hidden" : ""} renderAnimation={renderAnimation} setInputValue={setInputValue}/>

    </>
  )
}
