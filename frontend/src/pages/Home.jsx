import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import { IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '@mui/material/Button';
import { AuthContext } from '../contexts/AuthContext';

function Home() {
  const [meetingCode, setMeetingCode] = useState("");
  let routeTo = useNavigate();

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode)
    routeTo(`/${meetingCode}`);
  }

  return (
    <>
      <div style={{padding: "10px"}} className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Meelo Video Call</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => routeTo("/history")}>
            <RestoreIcon />
            <p>History</p>
          </IconButton>

          <Button onClick={() => {
            localStorage.removeItem("token");
            routeTo("/auth");
          }} variant='contained' color="error">
            Logout
          </Button>
        </div>
      </div>
      <hr />

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2> MEELO Video Call! makes miles to milimeters.</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <TextField onChange={event => setMeetingCode(event.target.value)} id="filled-basic" label="Meeting Code" variant="filled" />
              <Button onClick={handleJoinVideoCall} variant="contained">Join</Button>
            </div>
          </div>
        </div>

        <div className="rightPanel">
          <img src="/logo4.png" alt="" />
        </div>
      </div>
    </>
  )
}

export default withAuth(Home);