import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import './App.css';

declare var ZoomMtg

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

function App(){
  return (
    <Router basename="/websdk-sample-react">
      <div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/room/:meetingNumber">
            <Room />
          </Route>
        </Switch>
      </div>
    </Router>
  );	
}


function Room() {

  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  var signatureEndpoint = 'https://desolate-wave-37126.herokuapp.com/'
  var apiKey = 'QfdRaPVDRsWuI93xugQEpQ'
  var { meetingNumber } = useParams();
  var role = 0
  var leaveUrl = 'http://localhost:3000'
  var userName = 'Tony Tèo'
  var userEmail = 'linhnguyengts@gmail.com'
  var passWord = ''

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: parseInt(meetingNumber),
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      isSupportAV: true,
      success: (success) => {

        ZoomMtg.join({
          signature: signature,
          meetingNumber: parseInt(meetingNumber),
          userName: userName,
          apiKey: apiKey,
          userEmail: userEmail,
          passWord: passWord,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom WebSDK Sample React</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
