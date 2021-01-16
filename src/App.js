import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [blacklist, setBlacklist] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [seperate, setSeperate] = useState(false);

  var payload = {
    blacklistData: blacklist
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/test', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        "Content-Type":"application/json"
      })
    }).then(data => data.json()).then(json => console.log(json));
  }

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The current time is {currentTime}.</p>
	<form onSubmit={handleSubmit}>
	  <p>Enter your blacklist</p>
	  <input
	    type='text'
	    id='input'
	    name='blacklist'
	    value={blacklist}
	    onChange={event => setBlacklist(event.target.value)}
	  />
	  <input
	    type='submit'
	    value='submit'
	  />
	</form>
	<p>input is {blacklist}</p>
      </header>
    </div>
  );
}

export default App;
