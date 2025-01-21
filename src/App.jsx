import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css"
import Die from"./die.jsx"
import {nanoid} from "nanoid"
import Confetti from './Confetti.jsx'
import audioFile from "./audio.mp3";

export default function App(){

  
  function generateAllNewDice() {
    return new Array(10).fill(null).map(() =>({
              value:Math.ceil(Math.random() * 5),
              isHeld:false,
              id:nanoid()
              })
            );
  }

  function rollDice(gameWon){
  
    if(gameWon){
      setCount(0);
      setRandomNumbers(generateAllNewDice());
      setTime(0);
    }
    else {
    setCount(prev => prev+1);
    setRandomNumbers((oldarr) => 
      oldarr.map((item)=>
         item.isHeld ? item :{...item,value:Math.ceil(Math.random() * 5)}
    ));
  }
  }

  function hold(id){
    setIsRunning(true);
    setRandomNumbers(oldarr => 
      oldarr.map( (item)=>
       item.id===id ? {...item ,isHeld:!item.isHeld} : item
    ))
  }
  const [highScore,setHighScore]=React.useState("-");
  const [time,setTime]=React.useState(0);
  const [isRunning,setIsRunning]=React.useState(false);
  
  const [count,setCount]=React.useState(0);
  
  const newGameFocusElement=React.useRef(null);
  
  const audioElement=React.useRef(null);
  
  const [randomNumbers,setRandomNumbers]=React.useState(() => generateAllNewDice());
  
  const diceElements=randomNumbers.map((dieObj)=> <Die key={dieObj.id}
                                                       value={dieObj.value}
                                                       isHeld={dieObj.isHeld} 
                                                       hold={hold}
                                                       id={dieObj.id}
                                                       />
                                    )

    const gameWon= (randomNumbers.every( (value)=> value.isHeld ) &&
                 randomNumbers.every( (value)=> value.value===randomNumbers[0].value))
   
    React.useEffect(() => {
       if(gameWon){
        newGameFocusElement.current.focus();
        audioElement.current.play();
        setIsRunning(false);
        setHighScore(prev => prev==="-"?time:Math.min(prev,time));
      }
    } ,[gameWon]);
    useEffect(() => {
      let timer;
      if (isRunning) {
        timer = setInterval(() => {
          setTime((prevTime) => prevTime + 1); // Increase the time by 1 second
        }, 1000);
      }
  
      return () => clearInterval(timer); // Cleanup the interval on component unmount
    }, [isRunning]);


  
  
  

    return (
      <main>
        <div className="container">
          <div className="subContainer">
              <h2 className="header">Tenzies</h2>
              <p>Roll until dice are the same. Click each die to freeze its current value between rolls. </p>
              <div className="diceContainer">
                {diceElements}
              </div>
              <button className="rollButton" ref={newGameFocusElement} onClick={() => rollDice(gameWon)}>{!gameWon ? "Roll" : "New Game"}</button>
          </div>
          {gameWon && <div>
              <Confetti/>
              <audio ref={audioElement} src={audioFile} />
            </div>}
          

        </div>
        <h4>number of rolls:{count}</h4>
        <h5>timer:{time} s</h5>
        <h5>high score: {highScore} s</h5>
        </main>
    )

}