import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
// import crypto, { randomBytes } from "crypto"; 
// we used both so both imp, not like inside crypto randombyte has come or vice versa
import { randomBytes } from "crypto"; // better
import { Meeting } from "../models/meeting.model.js";

const login = async (req, res) => {

    let { username, password } = req.body;
    
    if (!username) {
        return res.status(400).json({ message: "Please Provide username" });
    }

    if (!password) {
        return res.status(400).json({ message: "Please Provide password" });
    }

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
        }
        
        let isOk = await bcrypt.compare(password, user.password); // sir corrected this later

        if (isOk) {
            // let token = crypto.randomBytes(20).toString("hex"); 
            let token = randomBytes(20).toString("hex"); // better
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({message: "invalid username or password"});
        }

        return res.status(httpStatus.UNAUTHORIZED).json({message: "wrong password"});

    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` });
    }
}


const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        let existingUser = await User.findOne({ username });

        if (existingUser) {
           return res.status(httpStatus.FOUND).json({ message: "User Already Exists" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let newUser = new User(
            {
                name: name,
                username: username,
                password: hashedPassword
            }
        )

        await newUser.save();

        return res.status(httpStatus.CREATED).json({ message: "User Registerd" });

    } catch (e) {
        return res.json(`Something went wrong => ${e}`);
    }
}


const getUserHistory = async (req, res) => {
    const {token} = req.query;

    try {
        const user = await User.findOne({token: token});
        const meetings = await Meeting.find({user_id: user.username});
        res.json(meetings);
    } catch (err) {
        res.json({message: `something went wrong ${err}`});
    }
}

const addToHistory = async (req, res) => {
    const {token, meeting_code} = req.body;
    try {
        const user = await User.findOne({token: token});
        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({message: "Added code to history"});
    } catch (err) {
       res.json({message: `something went wrong ${err}`});
    }
}

export { register, login, getUserHistory, addToHistory };
