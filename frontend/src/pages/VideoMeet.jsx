import React, { useEffect, useRef, useState } from 'react';
// import "../styles/VideoMeet.css";
import styles from "../styles/VideoMeet.module.css";

import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';

import { Badge, Button, IconButton, TextField } from '@mui/material';
import { io } from 'socket.io-client';

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

  let [video, setVideo] = useState([]);

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(); // name different

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(3);

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
    try { // try-catch => On first run, window.localStream may not exist , Prevents app crash
      window.localStream.getTracks().forEach(track => track.stop())
    } catch (e) { console.log(e) }  // catch(e => console.log(e)); // won't work only at .catch()

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    // NEW SDP after onended
    for (let id in connections) {
      if (id === socketIdRef.current) continue;
      connections[id].addStream(window.localStream)
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description)
          .then(() => {
            // yes => mistake- socketRef,
            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
          }).catch(e => console.log(e));
      })
    }

    stream.getTracks().forEach(track => track.onended = () => {
      setVideo(false)
      setAudio(false);

      try {
        let tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())

        // TODO Black silence
        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
        window.localStream = blackSilence();
        localVideoRef.current.srcObject = window.localStream;

        for (let id in connections) {
          connections[id].addStream(window.localStream)
          connections[id].createOffer().then((description) => {
            connections[id].setLocalDescription(description)
              .then(() => {
                socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                  .catch(e => console.log(e));
              })
          })
        }
      } catch (e) { console.log(e) }
    })
  }

  let silence = () => {
    let ctx = new AudioContext()
    let oscillator = ctx.createOscillator(); // creating silence tone

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
  }

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  }

  // when audio or video toggle is on or off
  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)   //TODO get user media success
        .then((stream) => { })
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      } catch (e) { }
    }
  }

  useEffect(() => {
    if (video != undefined && audio != undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  //TODO 
  let gotMessageFromServer = (fromId, message) => {
    let signal = JSON.parse(message);
    // yes => mistake - it should be socketIdRef.current
    if (fromId !== socketIdRef) {
      if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === "offer") {
            connections[fromId].createAnswer().then((description) => {
              connections[fromId].setLocalDescription(description).then(() => {
                // yes => should we set setLocalDescription()?
                // yes => mistake-doubt - should it be socketRef.current ?
                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
              }).catch(e => console.log(e));
            }).catch(e => console.log(e));
          }
        }).catch(e => console.log(e));
      }
      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
      }
    }
  }

  //TODO
  let addMessage = () => {

  }

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;
      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        //not setVideo
        setVideos((videos) => videos.filter((video) => video.socketId != id));
      })

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate != null) {
              socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
            }
          }

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(video => video.socketId === socketListId);
            if (videoExists) {
              setVideos(videos => {
                const updatedVideos = videos.map(video =>
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video
                )
                videoRef.current = updatedVideos;
                return updatedVideos;
              })
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsinline: true
              }
              setVideos(videos => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              })
            }
          }

          if (window.localStream != undefined && window.localStream != null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            // TODO
            // let blackSilence
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        })

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue

            try {
              connections[id2].addStream(window.localStream)
            } catch (err) { }

            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                }).catch(e => console.log(e));
            })
          }
        }
      })

    })
  }

  let getMedia = () => {
    setVideo(() => videoAvailable);  // i have putin arrow func
    setAudio(() => audioAvailable);
    connectToSocketServer();
  }

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  }

  let handleVideo = () => {
    setVideo(!video); // what is reverse? => boolean value hai
  }

  let handleAudio = () => {
    setAudio(!audio);
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
          </div> :

          <div className={styles.meetVideoContainer}>

            <div className={styles.buttonContainers}>
              <IconButton onClick={handleVideo} style={{ color: "white", }}>
                {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>

              <IconButton style={{ color: "red", }}>
                {<CallEndIcon />}
              </IconButton>

              <IconButton onClick={handleAudio} style={{ color: "white", }}>
                {(audio === true) ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              {screenAvailable === true ?
                <IconButton style={{ color: "white" }}>
                  {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                </IconButton> :
                <></>}

              <Badge badgeContent={newMessages} max={999} color='primary'>
                <IconButton style={{ color: "white", }}>
                  <ChatIcon />
                </IconButton>
              </Badge>

            </div>

            <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted></video>
            <div className={styles.conferenceView} >
              {videos.map((video) => (
                <div key={video.socketId}>

                  <video
                    data-socket={video.socketId}
                    ref={ref => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                  ></video>
                </div>
              ))}
            </div>
          </div>

      }
    </div>

  )
}

//  window.location.href  = to know current route
// just to know = explore by self
// let connections = useRef({});
// connections.current
