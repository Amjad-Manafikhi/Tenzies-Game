import React from "react";
import "./die.css";

export default function Die(props){

    const buttonClass = {
        backgroundColor:props.isHeld ? "#59E391":"white"
    };
    
    return(
        <button style={buttonClass} onClick={()=>{props.hold(props.id)}}>{props.value}</button>
    )
}   