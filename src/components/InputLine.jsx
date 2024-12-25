import { useRef, useEffect } from "react";

export default function InputLine({author, className, setInputValue}) {
    const ref= useRef();


    function keydownHandler(e) {
        if (e.key === "Enter") {
            console.log("Enter pressed");
            setInputValue(e.target.value);
      }
    }

    useEffect(() => {
        ref.current.focus();
    });

    return (
      <span className={`input-line ${className}`}>
        
        <span className="input-line-prompt">{author}{' >> '}</span>
        <input className="input-line-input input" ref={ref} onKeyDown={keydownHandler} />
      </span>
    );
}