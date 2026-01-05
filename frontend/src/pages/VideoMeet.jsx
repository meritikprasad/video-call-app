import React, { useEffect, useRef, useState } from 'react';
import "../styles/VideoMeet.css";
import { Button, TextField } from '@mui/material';

const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
  "iceServers": [
    { "urls": "stun:stun.l.google.com:19302" }
  ]
}

export default function VideoMeet() {

  var socketRef = useRef();
  let socketIdRef = useRef();

  // for video stream
  let localVideoRef = useRef();   // for video dom
  let [videoAvailable, setVideoAvailable] = useState(true);   // for media stream
  let [audioAvailable, setAudioAvailable] = useState(true);   // for media stream

  let [video, setVideo] = useState();

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(); // name different

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  // TODO
  // if(isChrome() === false) {
  // }

  // for initail permission
  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoPermission) {
        setVideoAvailable(() => true);
      } else {
        setVideoAvailable(() => false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (audioPermission) {
        setAudioAvailable(() => true);
      } else {
        setAudioAvailable(() => false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(() => true);
      } else {
        setScreenAvailable(() => false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            console.log(document.getElementsByTagName("video"));
            localVideoRef.current.srcObject = userMediaStream; // or localStream
          }
        }
      }

    } catch (err) {
      console.log(err);
    }
  }

  // for initail permission
  useEffect(() => {
    getPermissions();
  }, [])

  let getUserMediaSuccess = (stream) => {

  }  

  // when audio or video toggle is on or off
  let getUserMedia = () => {
    if((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices.getUserMedia({video: video, audio: audio})
      .then(getUserMediaSuccess)   //TODO get user media success
      .then((stream) => { })
      .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      } catch(e) { }
    }
  }

  useEffect(() => {
    if(video != undefined && audio != undefined) {
      getUserMedia();
    }
  }, [audio, video])

  let getMedia = () => {
    setVideo(() => videoAvailable);  // i have putin arrow func
    setAudio(() => audioAvailable);
    // getUserMedia(); yahan nahin upar karna chahye
    connectToSocketServer();
  }

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  }

  return (

    <div>
      {
        askForUsername === true ?
          <div>
            <h2>Enter into Lobby</h2>
            <TextField id="filled-basic" variant="filled" label="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <Button variant="contained" onClick={connect}>Connect</Button>

            <div>
              <video ref={localVideoRef} autoPlay muted></video>
            </div>
          </div> : <></>
      }
    </div>

  )
}

//  window.location.href  = to know current route
// just to know = explore by self
// let connections = useRef({});
// connections.current
