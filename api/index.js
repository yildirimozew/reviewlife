const express = require("express");
const mongoose = require("mongoose");
const cookie_parser = require("cookie-parser");
const UserModel = require("./models/User.js");
const ReviewModel = require("./models/Review.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const cors = require("cors");
const ws = require("ws");
dotenv.config();

const bcrypt_salt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());
app.use(cookie_parser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}))

app.get("/test", (req, res) => {
    res.json("test ok");
})

app.get("/profile", (req, res ) => {
    const token = req.cookies?.token;
    if(token){
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if(err) throw err;
            res.json(userData);
        })
    } else{
        res.status(401).json("no token");
    }
    
})

app.get("/reviews", async (req, res) => {
    const token = req.cookies?.token;
    if(token){
        const reviews = await ReviewModel.find({});
        res.json(reviews);
    }
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await UserModel.findOne({username});
    if(foundUser){
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if(passOk){
            jwt.sign({userId:foundUser._id, username}, jwtSecret, {}, (err, token) => {
                if(err){
                    console.error("Error generating token:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                res.cookie("token", token, {sameSite:"none", secure: true}).status(201).json({
                    id: foundUser._id,
                });
            });
        }
    }
})

app.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try {
        const hashedPass = bcrypt.hashSync(password, bcrypt_salt);
        const createdUser = await UserModel.create({
            username:username, password:hashedPass
        });
        jwt.sign({userId:createdUser._id, username}, jwtSecret, {}, (err, token) => {
            if(err){
                console.error("Error generating token:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.cookie("token", token, {sameSite:"None", secure: true}).status(201).json({
                id: createdUser._id,
            });
        });
    } catch (err) {
        if (err) throw err;
    }
})

const server = app.listen(4000);

const wss = new ws.WebSocketServer({server});

wss.on("connection", (connection, req) => {
    
    const cookies = req.headers.cookie;
    if(cookies){
        const tokenCookieString = cookies.split(";").find(str => str.startsWith("token="));
        if(tokenCookieString){
            const token = tokenCookieString.split("=")[1];
            if(token){
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if(err){throw err;}
                    const {userId, username} = userData;
                    connection.userId = userId;
                    connection.username = username;
                    /*we collect every client's userId and username in wss*/
                });
            }
        }
    }
    connection.on("message", async (message) => {
        message = JSON.parse(message.toString());
        const {review, opinion} = message;
        if(review && opinion){
            const reviewDoc = await ReviewModel.create({
                sender: connection.userId,
                review,
                opinion,
            });
            [...wss.clients].forEach(c => c.send(JSON.stringify({
                review, opinion, senderId: connection.userId,
                senderName: connection.username, id: reviewDoc._id
            })))
        }
    })
})

