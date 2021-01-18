import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import linkhelp1 from './linkhelp1.jpg';
import './App.css';

const THEME = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  const [inputLink, setInputLink] = useState('');
  const [blacklist, setBlacklist] = useState('');
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [separate, setSeparate] = useState(false);
  const [excludeEvents, setExcludeEvents] = useState(false);
  const [excludeHelpText, setExcludeHelp] = useState('');
  const [moreInfoText, setMoreInfoText] = useState({display: "none"});
  const [linkHelpText, setLinkHelpText] = useState({display: "none"});
  const [blacklistHelpText, setBlacklistHelp] = useState({display: "none"});
  const [dateHelpText, setDateHelp] = useState({display: "none"});
  const [output, setOutput] = useState(<div></div>);
  const [loading, setLoading] = useState(<div></div>);
  const [disabled, setDisabled] = useState('disabled');

  const convertToISO = (day) => {
    try {
      return day.toISOString();
    } catch (e) {
      return "";
    }
  }

  var payload = {
    postData: {
      inputLinkData: inputLink,
      blacklistData: blacklist,
      separateData: separate,
      excludeEventsData: excludeEvents,
      startDate: convertToISO(startDate).substring(0,10),
      endDate: convertToISO(endDate).substring(0,10)
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
      setOutput(<div id='output'><p>Whoops! Looks like something went wrong. Refresh the page and try again.</p></div>);
    }
  }

  const moreInfo = () => {
    if(Object.keys(moreInfoText).length == 0) setMoreInfoText({display: "none"});
    else setMoreInfoText({});
  }

  const excludeHelp = () => {
    if(excludeHelpText === "") setExcludeHelp("This will remove all of the 'events' from the calendar, meaning only things such as quizzes or assignments will be left on the calendar. (Click the question mark again to close this message)");
    else setExcludeHelp("");
  }

  const linkHelp = () => {
    if(Object.keys(linkHelpText).length == 0) setLinkHelpText({display: "none"});
    else setLinkHelpText({});
  }

  const blacklistHelp = () => {
    if(Object.keys(blacklistHelpText).length == 0) setBlacklistHelp({display: "none"});
    else setBlacklistHelp({});
  }

  const dateHelp = () => {
    if(Object.keys(dateHelpText).length == 0) setDateHelp({display: "none"});
    else setDateHelp({});
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

  const error = () => {
    if(validURL(inputLink) === "") return false;
    else return true;
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
    setStartDate(day);
  }

  const handleEndDate = (day) => {
    setEndDate(day);
  }

  const disabledChecker = () => {
    if(validURL(inputLink) !== "" || inputLink === "") return "disabled";
    else return "";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(<div id='loading'><p>loading....</p></div>);
    fetch('/api/PostCal', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        "Content-Type":"application/json"
      })
    }).then(data => data.json()
    ).then(json => {
      console.log(json);
      setLoading(<div id='loading'></div>);
      outputHTML(json);
    }).catch(error=> {
      outputHTML("djfds");
      setLoading(<div id='loading'></div>);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
	<h1>Canvas Calendar Cleaner</h1>
        <p>Welcome to the Canvas Calendar Cleaner. Input your calendar link straight from Canvas along with any additional parameters as desired. We'll give you a link that you can use for <b>10 minutes</b> before it expires.</p>
        <p>Click on the question mark next to each element to learn more about them!</p>
	<button onClick={moreInfo}>Click here to show/hide more information</button>
	<div class='moreInfo' style={moreInfoText}>
	  <h2>Explanation of inputs</h2>
	  <p><b>Canvas calendar link:</b> This is where you paste the link straight from the Canvas website</p>
	  <p><b>Blacklist:</b> Any event from the original calendar whose title matches any keywords in the blacklist will be removed. Make sure keywords are separated by a comma. Not doing this may lead to unintended side effects.</p>
	  <p><b>Calendar start date:</b> Any events that take place before this date will be removed.</p>
	  <p><b>Calendar end date:</b> Any events that take place after this date will be removed.</p>
	  <br/>
          <p><i>This is a webapp originally created for HackDavis 2021. Made by Tim Stewart, Aidan Lee, Peter Yu, and Jun Min Kim</i></p>
	</div>
	<hr/>
	<MuiThemeProvider theme={THEME}>
	<MuiPickersUtilsProvider utils={DateFnsUtils}>
	<form onSubmit={handleSubmit} autoComplete="off" >
	  <TextField
	    color="secondary"
	    error={Boolean(error())}
	    type='text'
	    margin='normal'
	    id='input'
	    label='Canvas Calendar Link'
	    name='inputLink'
	    value={inputLink}
	    placeholder="https://canvas.ucdavis.edu/feeds/calendars/user_JSDFLUgjvmsdalkjSDIg.ics"
	    onChange={event => setInputLink(event.target.value)}
	    helperText={validURL(inputLink)}
	  />
	  <sup> <a href="javascript:void(0);" onClick={linkHelp}>[?]</a></sup>
	  <div id='linkHelp' style={linkHelpText}>
	    <p>The link may be found here on the canvas website:</p>
	    <img src={linkhelp1} />
	  </div>
	<br/>
	  <TextField
	    color="secondary"
	    label='Blacklist'
	    type='text'
	    margin='normal'
	    id='input'
	    name='blacklist'
	    value={blacklist}
	    placeholder='Lecture, Discussion, etc.'
	    onChange={event => setBlacklist(event.target.value)}
	  />
	  <sup> <a href='javascript:void(0)' onClick={blacklistHelp}>[?]</a></sup>
	  <div id='blacklistHelp' style={blacklistHelpText}>
	    <p>Any event from the original calendar whose title matches any keywords in the blacklist will be removed. Make sure keywords are seperated by a comma. Not doing this may lead to unintended side effects.</p>
	  </div>
	<br/>
	  {/*<label>Calendar start date: <DayPickerInput onDayChange={handleStartDate} /> </label>*/}
	  <KeyboardDatePicker
	    color="secondary"
	    label="Calendar start date"
	    margin='normal'
	    variant="inline"
	    format="yyyy-MM-dd"
	    value={startDate}
	    onChange={handleStartDate}
	  />
	  <KeyboardDatePicker
	    color="secondary"
	    label="Calendar end date"
	    margin='normal'
	    variant="inline"
	    format="yyyy-MM-dd"
	    value={endDate}
	    onChange={handleEndDate}
	  /><sup><a href='javascript:void(0);' onClick={dateHelp}>[?]</a></sup>
	  <div id='dateHelp' style={dateHelpText}>
	    <p>This is <b>optional</b>. Only fill these out if you want to cut off events from before or after a specific date</p>
	  </div>
	  {/*<label>Calendar end date: <DayPickerInput onDayChange={handleEndDate} /> </label>*/}
	<br/>
	<label>Split calendar by class:
	  <Checkbox
	    id='checkbox'
	    name='separate'
	    value={separate}
	    onChange={event => setSeparate(!separate)}
	  />
	</label>
	<br/>
	<label>Exclude all events<sup><a href="javascript:void(0);" onClick={excludeHelp}>[?]</a></sup>:
	  <Checkbox
	    id='checkbox'
	    name='excludeEvents'
	    value={excludeEvents}
	    onChange={event => setExcludeEvents(!excludeEvents)}
	  />
	</label>
	<p id='excludeHelp'>{excludeHelpText}</p>
	  <br/>
	  <input
	    type='submit'
	    value='Submit'
	    disabled={disabledChecker()}
	  />
	</form>
	</MuiPickersUtilsProvider>
	</MuiThemeProvider>
	{loading}
	{output}
      </header>
    </div>
  );
}

export default App;
