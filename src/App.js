import React, { useState } from 'react';
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
  const [output, setOutput] = useState(<div></div>);
  var showMore = false;

  var payload = {
    inputLinkData: inputLink,
    blacklistData: blacklist,
    seperateData: seperate,
    excludeEventsData: excludeEvents
  }

  const outputHTML = (json) => {
    var outputHTMLarray = [];
    for(let i = 0; i < json.output.length; i++) {
      outputHTMLarray[i] = <><a href={"\""+json.output[i]+"\""} key={i}>{json.output[i]}</a><br/></>;
    }
    console.log(json.output.length);
    setOutput(<div id='output'><hr/><h2>Your new calendar links:</h2><p>{outputHTMLarray}</p></div>);
  }

  const moreInfo = () => {
    if(moreInfoText === "") setMoreInfoText("This is a webapp originally created for HackDavis 2021. Made by Tim Stewart, Aidan Lee, Peter Yu, and Jun Min Kim");
    else setMoreInfoText("");
  }

  const validURL = (str) => {
    if(str==="") return "";
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
        <p>Welcome to the Canvas Calendar Cleaner. Input your calendar link straight from Canvas along with any additional parameters as desired. We'll give you a link that you can use for <b>10 minutes</b> before it expires.</p>
	<button onClick={moreInfo}>Click here to show/hide more information</button>
	<p id='moreInfo'>{moreInfoText}</p>
	<hr/>
	<form onSubmit={handleSubmit}>
	  <label> Enter your calendar link:
	  <input
	    type='text'
	    id='input'
	    name='inputLink'
	    value={inputLink}
	    onChange={event => setInputLink(event.target.value)}
	  />
	  </label>
	  <p id='warning'>{validURL(inputLink)}</p>
	  <label>Enter your blacklist:
	  <input
	    type='text'
	    id='input'
	    name='blacklist'
	    value={blacklist}
	    onChange={event => setBlacklist(event.target.value)}
	  />
	  </label>
	<br/>
	<label>Seperate the calendar by class:
	  <input
	    type='checkbox'
	    id='checkbox'
	    name='seperate'
	    value={seperate}
	    onChange={event => setSeperate(!seperate)}
	  />
	</label>
	<br/>
	<label>Exclude all events:
	  <input
	    type='checkbox'
	    id='checkbox'
	    name='excludeEvents'
	    value={excludeEvents}
	    onChange={event => setExcludeEvents(!excludeEvents)}
	  />
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
