import React from "react";
import { useEffect, useRef, useState } from "react";
import { sentences } from "./sentences.js";

function App() {
  const [text, setText] = useState("");
  const [input, setinput] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [result, setResult] = useState(null);

  const [resultHistory, setResultHistory] = useState([]);

  const [timer, setTimer] = useState(60);
  const inputRef = useRef(null);

  useEffect(() => {
    resetTest();
  }, []);

  useEffect(() => {
    let interval;
    if (startTime && !endTime && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0 && !result) {
      calculateResult(startTime, new Date(), true);
    }

    return () => clearInterval(interval);
  }, [startTime, timer, endTime, result]);

  const resetTest = () => {
    const random = sentences[Math.floor(Math.random() * sentences.length)];
    setText(random);
    setinput("");
    setStartTime(null);
    setEndTime(null);
    setResult(null); // 👈 Important fix
    setTimer(60);
    inputRef.current.focus();
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setinput(val);

    if (!startTime && val.length > 0) {
      const now = new Date();
      setStartTime(now);
    }

    if (val === text) {
      const end = new Date();
      setEndTime(end);
      calculateResult(startTime, end);
    }
  };

  const calculateResult = (start, end, isTimeout = false) => {
    if (!start) return; // avoid calculation if typing never started

    const timeTaken = (end - start) / 1000;
    const words = text.trim().split(" ").length;
    const speed = Math.round((words / timeTaken) * 60);
    const correctChars = input
      .split("")
      .filter((ch, i) => ch === text[i]).length;
    const accuracy = Math.round((correctChars / text.length) * 100);

    const res = {
      speed: isTimeout ? 0 : speed,
      accuracy,
      time: isTimeout ? 60 : timeTaken.toFixed(2),
    };

    setResult(res);
    setResultHistory((prev) => [res, ...prev]);
  };

  const getHighlightedText = () => {
    return text.split("").map((char, idx) => {
      let typedChar = input[idx];
      let className = "";
      if (typedChar === undefined) className = "";
      else if (typedChar === char) className = "correct";
      else className = "incorrect";

      return (
        <span key={idx} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-4">
            💻 Typing Speed Tester
          </h1>

          <p className="text-right text-gray-600 mb-2 font-medium">
            Time Left: <span className="font-bold">{timer}s</span>
          </p>

          <div className="bg-gray-100 p-4 md:p-6 rounded-md shadow-inner">
            <p className="text-lg md:text-xl font-medium text-gray-800 mb-4 whitespace-pre-wrap break-words">
              {getHighlightedText()}
            </p>

            <textarea
              ref={inputRef}
              className="w-full h-32 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
              placeholder="Start typing here..."
              value={input}
              onChange={handleChange}
              disabled={result || timer === 0}
            />

            {result ? (
              <div className="mt-6 text-center space-y-2">
                <p className="text-xl text-green-600 font-semibold">
                  Speed: {result.speed} WPM
                </p>
                <p className="text-lg text-blue-600 font-medium">
                  Accuracy: {result.accuracy}%
                </p>
                <p className="text-gray-700">
                  Time Taken: {result.time} seconds
                </p>
                <button
                  onClick={resetTest}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">
                Type the above sentence to test your speed.
              </p>
            )}
          </div>

          {resultHistory.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Past Results
              </h3>
              <ul className="space-y-2 text-sm md:text-base">
                {resultHistory.map((r, i) => (
                  <li
                    key={i}
                    className="bg-gray-50 p-3 rounded-md border border-gray-200"
                  >
                    <b>{i + 1}.</b> Speed: {r.speed} WPM | Accuracy:{" "}
                    {r.accuracy}% | Time: {r.time}s
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
