import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
// import crypto, { randomBytes } from "crypto"; 
// we used both so both imp, not like inside crypto randombyte has come or vice versa
import { randomBytes } from "crypto"; // better


const login = async (req, res) => {

    let { username, password } = req.body;
    
    if (!username) {
        res.status(400).json({ message: "Please Provide username" });
    }

    if (!password) {
        res.status(400).json({ message: "Please Provide password" });
    }

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
        }
        
        let isOk = await bcrypt.compare(password, user.password);

        if (isOk) {
            // let token = crypto.randomBytes(20).toString("hex"); 
            let token = randomBytes(20).toString("hex"); // better
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
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
            res.status(httpStatus.FOUND).json({ message: "User Already Exists" });
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

        res.status(httpStatus.CREATED).json({ message: "User Registerd" });

    } catch (e) {
        res.json(`Something went wrong => ${e}`);
    }
}


export { register, login };
