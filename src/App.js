import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [inputLink, setInputLink] = useState('');
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
	<h1>Canvas Calendar Cleaner</h1>
        <p>Welcome to the canvas calendar cleaner. Input your calendar link given by canvas along with any addition parameters you may wish for. We'll give you a link that you can use for <b>10 minutes</b> before it expires. The current time is {currentTime}.</p>
	<form onSubmit={handleSubmit}>
	  <p>Enter your calendar link:</p>
	  <input
	    type='text'
	    id='input'
	    name='inputLink'
	    value={inputLink}
	    onChange={event => setInputLink(event.target.value)}
	  />
	  <p>Enter your blacklist:</p>
	  <input
	    type='text'
	    id='input'
	    name='blacklist'
	    value={blacklist}
	    onChange={event => setBlacklist(event.target.value)}
	  />
	<br/>
	<label>
	  <input
	    type='checkbox'
	    id='seperate'
	    name='seperate'
	    value={seperate}
	    onChange={event => setSeperate(!seperate)}
	  />Seperate the calendar by class
	</label>
	  <br/>
	  <input
	    type='submit'
	    value='Submit'
	  />
	</form>
      </header>
    </div>
  );
}

export default App;
