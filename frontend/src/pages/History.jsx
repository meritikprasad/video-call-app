import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import HomeIcon from '@mui/icons-material/Home';

export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                console.log("history hello");
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                // IMPLEMENT SNACKBAR
                console.log(err);
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const mon = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear(); // not getYear minus 1900

        return `${day}/${mon}/${year}`;
    }

    let formatTime = (dateString) => {
        const date = new Date(dateString);

        return `${date.getHours().toString().padStart(2, "0") + ":" +
            date.getMinutes().toString().padStart(2, "0")}`

        //         return `${date.getUTCHours().toString().padStart(2, "0") + ":" +
        //   date.getUTCMinutes().toString().padStart(2, "0")}`
    }

    return (
        <div>
            <IconButton onClick={() => { routeTo("/home") }}>
                <HomeIcon />
            </IconButton>
            {
                // (Array.isArray(meetings) && meetings.length) ?
                (meetings.length !== 0) ?
                    meetings.map((ele, i) => {
                        return (

                            <div key={i}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                            {ele.meetingCode}
                                        </Typography>

                                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                            {formatTime(ele.date)} <br />
                                            {formatDate(ele.date)}
                                        </Typography>

                                    </CardContent>

                                </Card>
                            </div >

                        )
                    }) : <> <h2 style={{padding: "20px", color: "gray"}}>No History Yet!</h2></>
            }
        </div>
    )
} 