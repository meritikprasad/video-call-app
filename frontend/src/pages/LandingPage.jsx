import { Button } from "@mui/material";
import "./LandingPage.css"
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {

    const routeTo = useNavigate();
    return (
        <div className="LandingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Meelo Video Call</h2>
                </div>
                <div className="navList">
                    <Button variant="contained" onClick={() => {
                        // window.location.href = "/asqurep"
                        routeTo("/adflad");
                    }}>Join as Guest</Button>
                    <Button variant="contained" onClick={() => {
                        routeTo("/auth");
                    }}>Register</Button>
                    <Button variant="contained" onClick={() => {
                        routeTo("/auth");
                    }} role="button">Login</Button>
                </div>
            </nav>

            <div className="LandingMainContainer">
                <div>
                    <h1><span style={{ color: "#ff9839" }}>Connect</span> with your loved Ones.</h1>
                    <p>Cover a distance by Meelo Video Call</p>
                    <div role="button">
                        <Link to="/auth"> Get Started</Link>
                    </div>
                </div>
                <div>
                    <img src="/mobile.png" alt="" />
                </div>
            </div>
        </div>

    )
}