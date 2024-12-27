'use client';
import { useEffect, useState } from "react";

export default function Line({ children, author="system", setTyping, renderAnimation=false, color }) {
    const [text, setText] = useState("");
    let renderTimer

    if(color){
    }else{
        if (author == 'system') {
            color = 'blue'
        }else{
            color = 'green'
        }

    }


    useEffect(() => {
        setTyping(true);
        renderText(children, 0);
    }, [children]);

    useEffect(() => {
        if (!renderAnimation) {
            clearTimeout(renderTimer);
            setText(children);
            setTyping(false);
        }
    }, [renderAnimation]);


    function renderText(text, currentIndex) {
        if (text) {
        }else{
            setTyping(false);
            return
        }
        if (currentIndex >= text.length) {
            setTyping(false);
            setText(text.slice(0, currentIndex));
            return;
        }
        renderTimer = setTimeout(() => {
            setText(text.slice(0, currentIndex + 1) + "_");
            renderText(text, currentIndex + 1);
        }, 50);
    }

    return (
      <div className={`line ${color}`}>
        { (author == 'system') ?
          <span className="input-line-prompt"></span>
          :
          <span className="input-line-prompt">{author}</span>
        }
        {' >> '}
        {text}
      </div>
    );
}
