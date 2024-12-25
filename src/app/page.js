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
    if (inputValue) {
      setHistory([...history, {author: userName, text: inputValue}]);
      setInputValue("");
    }
  }, [inputValue]);


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


  return (
    <>

      {historyElements}
      <InputLine key={history.length} author={userName} className={typing ? "hidden" : ""} setInputValue={setInputValue}/>

    </>
  )
}
