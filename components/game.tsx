"use client";
import React, { useState, useEffect, useCallback } from "react";

const COLOR_PALETTE = {
  darkTeal: "#264653",
  teal: "#2A9D8F",
  yellow: "#E9C46A",
  orange: "#F4A261",
  coral: "#E76F51",
};

const WORDS = ["Queen", "Whale", "Elephant", "Robot", "Tiger"];
const KEY_MAPPING = ["Q", "W", "E", "R", "T"];

const Game = () => {
  // Game State
  const [rounds, setRounds] = useState(20);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [currentKey, setCurrentKey] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [gameStatus, setGameStatus] = useState("not-started");
  const [matchTimestamp, setMatchTimestamp] = useState<number | null>(null);

  // Game Logic
  const startGame = () => {
    setScore(0);
    setCurrentRound(0);
    setGameStatus("playing");
    playNextRound();
  };

  const playNextRound = useCallback(() => {
    if (currentRound >= rounds) {
      setGameStatus("finished");
      return;
    }

    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setCurrentWord(WORDS[randomIndex]);
    setCurrentKey(KEY_MAPPING[randomIndex]);
    setTimeLeft(3);
    setCurrentRound((prev) => prev + 1);
    setMatchTimestamp(null);
  }, [currentRound, rounds]);

  const handleKeyPress = useCallback(
    (event: { key: string }) => {
      if (gameStatus !== "playing") return;

      if (event.key.toUpperCase() === currentKey) {
        const reactionTime = matchTimestamp ? Date.now() - matchTimestamp : 0;
        setScore((prev) => prev + Math.max(1000 - reactionTime, 0));
        playNextRound();
      } else {
        // Incorrect key press
        setScore((prev) => prev - 100);
      }
    },
    [gameStatus, currentKey, matchTimestamp, playNextRound]
  );

  // Timer and Event Listeners
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (gameStatus === "playing") {
      if (timeLeft > 0) {
        timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      } else {
        // Time ran out
        setScore((prev) => prev - 75);
        playNextRound();
      }
    }
    return () => clearTimeout(timerId);
  }, [timeLeft, gameStatus, playNextRound]);

  useEffect(() => {
    if (gameStatus === "playing") {
      window.addEventListener("keydown", handleKeyPress);
      setMatchTimestamp(Date.now());
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [gameStatus, handleKeyPress]);

  // Render Start Screen
  const renderStartScreen = () => {
    return (
      <div
        className="min-h-screen flex flex-col justify-between"
        style={{ backgroundColor: COLOR_PALETTE.yellow }}
      >
        {/* Whimsical Header */}
        <div
          className="text-center py-8"
          style={{ backgroundColor: COLOR_PALETTE.teal }}
        >
          <h1
            className="text-6xl font-bold tracking-wider"
            style={{
              color: COLOR_PALETTE.yellow,
              textShadow: "3px 3px 0px rgba(0,0,0,0.2)",
              fontFamily: "Comic Sans MS, cursive",
            }}
          >
            Speedy Words!
          </h1>
          <p className="text-xl mt-2" style={{ color: COLOR_PALETTE.yellow }}>
            A Wacky Reaction Game
          </p>
        </div>

        {/* Game Start Options */}
        <div className="flex flex-col items-center justify-center flex-grow space-y-6">
          <button
            onClick={startGame}
            className="text-2xl px-8 py-4"
            style={{
              backgroundColor: COLOR_PALETTE.darkTeal,
              color: "white",
            }}
          >
            Start Game
          </button>
          <div className="flex items-center space-x-4">
            <label
              className="text-xl"
              style={{ color: COLOR_PALETTE.darkTeal }}
            >
              Number of Rounds:
            </label>
            <select
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="p-2 rounded text-lg"
              style={{
                backgroundColor: COLOR_PALETTE.coral,
                color: "white",
              }}
            >
              {[10, 20, 30, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="text-center py-4 text-sm"
          style={{
            backgroundColor: COLOR_PALETTE.darkTeal,
            color: COLOR_PALETTE.yellow,
          }}
        >
          Created by{" "}
          <a
            href="https://juanmanuelalloron.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Juan Manuel Allo Ron
          </a>
        </footer>
      </div>
    );
  };

  // Render Playing Screen
  const renderPlayingScreen = () => {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        style={{ backgroundColor: COLOR_PALETTE.yellow }}
      >
        <div
          className="w-full max-w-md p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: COLOR_PALETTE.teal }}
        >
          <h3
            className="text-4xl font-bold text-center mb-6"
            style={{ color: COLOR_PALETTE.yellow }}
          >
            {currentWord}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="text-center p-4 rounded"
              style={{
                backgroundColor: COLOR_PALETTE.yellow,
                color: COLOR_PALETTE.darkTeal,
              }}
            >
              <div className="text-xl font-bold">Time Left</div>
              <div className="text-3xl">{timeLeft}s</div>
            </div>

            <div
              className="text-center p-4 rounded"
              style={{
                backgroundColor: COLOR_PALETTE.yellow,
                color: COLOR_PALETTE.darkTeal,
              }}
            >
              <div className="text-xl font-bold">Score</div>
              <div className="text-3xl">{score}</div>
            </div>
          </div>

          <div
            className="text-center p-4 rounded text-xl"
            style={{
              backgroundColor: COLOR_PALETTE.orange,
              color: COLOR_PALETTE.darkTeal,
            }}
          >
            Press Key: {currentKey}
          </div>

          <div
            className="mt-4 text-center text-lg"
            style={{ color: COLOR_PALETTE.yellow }}
          >
            Round {currentRound} / {rounds}
          </div>
        </div>
      </div>
    );
  };

  // Render Finished Screen
  const renderFinishedScreen = () => {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        style={{ backgroundColor: COLOR_PALETTE.coral }}
      >
        <div
          className="w-full max-w-md p-8 rounded-lg shadow-lg text-center"
          style={{ backgroundColor: COLOR_PALETTE.darkTeal }}
        >
          <h3
            className="text-4xl font-bold mb-6"
            style={{ color: COLOR_PALETTE.yellow }}
          >
            Game Over!
          </h3>

          <div
            className="text-3xl mb-6"
            style={{ color: COLOR_PALETTE.yellow }}
          >
            Final Score: {score}
          </div>

          <button
            onClick={() => setGameStatus("not-started")}
            className="text-xl px-6 py-3"
            style={{
              backgroundColor: COLOR_PALETTE.teal,
              color: "white",
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

  console.log(gameStatus)
  switch (gameStatus) {
    case "not-started":
      return renderStartScreen();
    case "playing":
      return renderPlayingScreen();
    case "finished":
      return renderFinishedScreen();
    default:
      return renderStartScreen();
  }
};

export default Game;
