import "./LandingPage.css"
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="LandingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Meelo Video Call</h2>
                </div>
                <div className="navList">
                    <p>Join as Guest</p>
                    <p>register</p>
                    <div role="button">Login</div>
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