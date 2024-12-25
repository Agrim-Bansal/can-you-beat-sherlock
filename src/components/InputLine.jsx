import { useRef, useEffect } from "react";

export default function InputLine({author, className, setInputValue}) {
    const ref= useRef();

    function changeHandler(e) {
        setInputValue(e.target.value);
    }

    useEffect(() => {
        ref.current.focus();
    });

    return (
      <span className={`input-line ${className}`}>
        
        <span className="input-line-prompt">{author}{' >> '}</span>
        <input className="input-line-input input" ref={ref} onChange={changeHandler}/>
      </span>
    );
}