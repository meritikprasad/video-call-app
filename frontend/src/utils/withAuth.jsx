import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => { // outer
    
    // react arrow component
    const AuthComponent = (props) => { // inner // ? how does it get props ?
        const router = useNavigate();

        const isAuthenticated = () => {
            if(localStorage.getItem("token")) {
                return true;
            }
            return false;
        }

        useEffect(() => {
            if(!isAuthenticated()) {
                router("/auth");
            }
        }, [])

        return <WrappedComponent {...props} /> // here props is object of key=value pair, hence it becomes normal call
    }
    return AuthComponent; // return inner
}

export default withAuth; // outer called