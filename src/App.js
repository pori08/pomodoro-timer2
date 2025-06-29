import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [session, setSession] = useState('work'); // 'work', 'short-break', 'long-break'
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Time's up for the current session
            clearInterval(intervalRef.current);
            playAudio();
            handleSessionEnd();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  const playAudio = () => {
    const audio = new Audio('/notification.mp3'); // Assuming you'll add a notification sound
    audio.play();
  };

  const handleSessionEnd = () => {
    if (session === 'work') {
      setPomodoroCount(pomodoroCount + 1);
      if ((pomodoroCount + 1) % 4 === 0) {
        setSession('long-break');
        setMinutes(15);
        setSeconds(0);
      } else {
        setSession('short-break');
        setMinutes(5);
        setSeconds(0);
      }
    } else {
      setSession('work');
      setMinutes(25);
      setSeconds(0);
    }
    setIsActive(false); // Pause after session ends, user can start next session
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setSession('work');
    setPomodoroCount(0);
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const getBackgroundColor = () => {
    switch (session) {
      case 'work':
        return 'bg-primary'; // Bootstrap primary blue
      case 'short-break':
        return 'bg-success'; // Bootstrap success green
      case 'long-break':
        return 'bg-info'; // Bootstrap info cyan
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={`App d-flex flex-column justify-content-center align-items-center vh-100 text-white ${getBackgroundColor()}`}>
      <h1 className="mb-4">Pomodoro Timer</h1>
      <div className="timer-display mb-4 p-5 border rounded-circle d-flex justify-content-center align-items-center" style={{ width: '300px', height: '300px', fontSize: '4rem' }}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <div className="controls mb-4">
        <button className="btn btn-light mx-2" onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-light mx-2" onClick={resetTimer}>
          Reset
        </button>
      </div>
      <div className="session-info">
        <p className="lead">Current Session: {session.replace('-', ' ').toUpperCase()}</p>
        <p className="lead">Pomodoros Completed: {pomodoroCount}</p>
      </div>
    </div>
  );
}

export default App;