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
  const [excludeEvents, setExcludeEvents] = useState(false);
  const [moreInfoText, setMoreInfoText] = useState('');
  var showMore = false;

  var payload = {
    inputLinkData: inputLink,
    blacklistData: blacklist,
    seperateData: seperate,
    excludeEventsData: excludeEvents
  };

  var output = (
    <div id="output"></div>
  );

  const outputHTML = (json) => {
    output = (
      <div id="output">
        <p>Here are your calendar links:</p>
      </div>
    );
  }

  const moreInfo = () => {
    //showMore = !showMore;
    if(moreInfoText == "") setMoreInfoText("This is a webapp originally created for HackDavis 2021. Made by Tim Stewart, Aidan Lee, Peter Yu, and Jun Min Kim");
    else setMoreInfoText("");
    console.log(showMore + " " + moreInfoText);
  }

  const validURL = (str) => {
    if(str=="") return "";
    var pattern = new RegExp('(canvas.ucdavis.edu/feeds/calendars/user_).{3,}.ics');
    if(!!pattern.test(str)) return "";
    else return "Warning! This link is invalid. Make sure this is copied straight from canvas.";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/test', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        "Content-Type":"application/json"
      })
    }).then(data => data.json()
    ).then(json => {
      console.log(json);
      outputHTML(json);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
	<h1>Canvas Calendar Cleaner</h1>
        <p>Welcome to the canvas calendar cleaner. Input your calendar link given by canvas along with any additional parameters as desired. We'll give you a link that you can use for <b>10 minutes</b> before it expires.</p>
	<button onClick={moreInfo}>Click here to show/hide more information</button>
	<p>{moreInfoText}</p>
	<form onSubmit={handleSubmit}>
	  <p>Enter your calendar link:</p>
	  <input
	    type='text'
	    id='input'
	    name='inputLink'
	    value={inputLink}
	    onChange={event => setInputLink(event.target.value)}
	  />
	  <p id='warning'>{validURL(inputLink)}</p>
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
	    id='checkbox'
	    name='seperate'
	    value={seperate}
	    onChange={event => setSeperate(!seperate)}
	  />Seperate the calendar by class
	</label>
	<br/>
	<label>
	  <input
	    type='checkbox'
	    id='checkbox'
	    name='excludeEvents'
	    value={excludeEvents}
	    onChange={event => setExcludeEvents(!excludeEvents)}
	  />Exclude all events
	</label>
	  <br/>
	  <input
	    type='submit'
	    value='Submit'
	  />
	</form>
	{output}
      </header>
    </div>
  );
}

export default App;
