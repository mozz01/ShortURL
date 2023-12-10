"use strict";

import express from "express";
import 'dotenv/config';

let chars = "";
// add ascii representation of 0-9, A-Z, and a-z to chars
for (let i = 0x30; i < 0x7B; i++) {
    // filter out invalid chars
    if ((i > 0x39 && i < 0x41) || (i > 0x5A && i < 0x61)) {
        continue;
    }
    chars += String.fromCharCode(i);
}

// create express server
const app = express();
const port = process.env.SERVICE_PORT;
app.listen(port, () => {
    console.log(`App listening on port ${port}.`)
});

// CORS headers
app.use("/", (req, res, next) => {
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  next();
});

// parse requests with json payloads
app.use("/", express.json());

// handler for POST requests
app.post("/", (req, res) => {
    // request must provide an object with a {length} property
    // {length} must be convertable to type number
    // numbers are converted to their absolute value
    if (Number.isInteger(Number(req.body.length))) {
        const length = Math.abs(req.body.length);
        let string = "";
        for (let i = 0; i < Number(length); i++) {
            string += chars[Math.floor(Math.random() * chars.length)]
        }
        // send random string in response
        console.log("Return:", string);
        res.status(200).json({"string": string})
    }
    else {
        // send error message in response
        res.status(400).json({"error": "invalid key or value provided"})
    }
});
