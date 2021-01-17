import React, { useState } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './App.css';

function App() {
  const [inputLink, setInputLink] = useState('');
  const [blacklist, setBlacklist] = useState('');
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState('');
  const [separate, setSeparate] = useState(false);
  const [excludeEvents, setExcludeEvents] = useState(false);
  const [excludeHelpText, setExcludeHelp] = useState('');
  const [moreInfoText, setMoreInfoText] = useState('');
  const [output, setOutput] = useState(<div></div>);
  const [disabled, setDisabled] = useState('disabled');

  var payload = {
    postData: {
      inputLinkData: inputLink,
      blacklistData: blacklist,
      separateData: separate,
      excludeEventsData: excludeEvents
    }
  }

  const outputHTML = (json) => {
    var outputHTMLarray = [];
    try {
      for(let i = 0; i < json.links.length; i++) {
        outputHTMLarray[i] = <><p key={-1-i}>Class {i + 1}'s calendar: <a href={json.links[i]} key={i}>{json.links[i]}</a></p></>;
      }
      setOutput(<div id='output'><hr/><h2>Your new calendar links:</h2>{outputHTMLarray}</div>);
    } catch (e) {
      
    }
  }

  const moreInfo = () => {
    if(moreInfoText === "") setMoreInfoText("This is a webapp originally created for HackDavis 2021. Made by Tim Stewart, Aidan Lee, Peter Yu, and Jun Min Kim");
    else setMoreInfoText("");
  }

  const excludeHelp = () => {
    if(excludeHelpText === "") setExcludeHelp("This will remove all of the 'events' from the calendar, meaning only things such as quizzes or assignments will be left on the calendar. (Click the question mark again to close this message)");
    else setExcludeHelp("");
  }

  const validURL = (str) => {
    if(str==="") {
      return "";
    }
    var pattern = new RegExp('(https://canvas.ucdavis.edu/feeds/calendars/user_).{3,}.ics');
    if(!!pattern.test(str)) {
      return "";
    }
    else return "Warning! This link is invalid. Make sure this is copied straight from canvas.";
  }

  const validBlacklist = (str) => {
    var blacklistWarning = "Warning! This input is invalid. Make sure your blacklist consists of keywords contained in quotes seperated with commas.";
    var splitBlack = str.split(',');
    splitBlack.forEach(black => {
      if(str.charAt(0) !== '"' || str.charAt(str.length - 1) !== '&quot' || str.substring(1, str.length - 1).includes('&quot')) return blacklistWarning;
      else return "";
    });
  }

  const handleStartDate = (day) => {
    setStartDate(day)
  }

  const disabledChecker = () => {
    if(validURL(inputLink) !== "") return "disabled";
    else return "";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/PostCal', {
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
	    placeholder="https://canvas.ucdavis.edu/feeds/calendars/user_JSDFLUgjvmsdalkjSDIg.ics"
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
	    placeholder='"Lecture", "Discussion", "etc."'
	    onChange={event => setBlacklist(event.target.value)}
	  />
	  </label>
	  <DayPickerInput onDayChange={handleStartDate} />
	<br/>
	<label>Split calendar by class:
	  <input
	    type='checkbox'
	    id='checkbox'
	    name='separate'
	    value={separate}
	    onChange={event => setSeparate(!separate)}
	  />
	</label>
	<br/>
	<label>Exclude all events<sup><a onClick={excludeHelp}>[?]</a></sup>:
	  <input
	    type='checkbox'
	    id='checkbox'
	    name='excludeEvents'
	    value={excludeEvents}
	    onChange={event => setExcludeEvents(!excludeEvents)}
	  />
	</label>
	<p>{excludeHelpText}</p>
	  <br/>
	  <input
	    type='submit'
	    value='Submit'
	    disabled={disabledChecker()}
	  />
	</form>
	{output}
      </header>
    </div>
  );
}

export default App;
