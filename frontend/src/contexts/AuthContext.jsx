import { createContext, useContext, useState } from "react";
import axios from "axios";
import  httpStatus from "http-status";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

const client = axios.create({
    // baseURL: "http://localhost:8000/api/v1/users"
    baseURL: `${server}/api/v1/users`
})

// ye react component hai
export const AuthProvider = ({children}) => {

    const authContext = useContext(AuthContext);

    const [userData, setUserData] = useState(authContext);

    const router = useNavigate();  // from where ? (cleared)

    const handleRegister = async (name, username, password) => {
        try {   
            let request = await client.post("/register", {
                // other than sir
                name,   
                username,
                password
            })

            if(request.status === httpStatus.CREATED) {
                return request.data.message;    // ye kya hai ? (cleared)
            }

        } catch(err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username,
                password
            });

            if(request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home");
            }
        }
        catch(err) {
            throw err;
        }

    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            console.log(request.data);
            return request.data;
        } catch (err) {
            throw err
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            })
            return request;
        } catch (err) {
            throw err;
        }
    }

    const data = {
        userData, setUserData, handleRegister, handleLogin, getHistoryOfUser, addToUserHistory
    }

    // jisko bhi AuthProvider ke andar rakh rahe unko provide kar de raha data value
    return (
        <AuthContext.Provider value={data}>
            {children}       {/* ye components tag hi hai, jinko jinko context se data availabel hoga*/}
        </AuthContext.Provider>
    )
}
