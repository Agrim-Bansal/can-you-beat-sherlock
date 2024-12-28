"use client";
import { useEffect } from "react";

export default function mouseOverlay(){

    useEffect(() => {
    document.addEventListener("mousemove", (e) => {
        const overlay = document.querySelector('.mouseOverlay');
        overlay.style.left = `${e.clientX - 42}px`;
        overlay.style.top = `${e.clientY - 21}px`; 
    });},);



    return(

        <div className="mouseOverlay" ></div>
    )
}