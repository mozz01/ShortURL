"use strict";

import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PROJECT_PORT;
const redirectionBaseURL = `http://localhost:${PORT}/`;
const dbBaseEndpoint = `http://localhost:${process.env.URLS_PORT}/urls`;
const beginning = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <meta name="robots" content="noindex, noarchive, nofollow">
        <meta name='viewport' content='width=device-width, initial-scale=1'>

        <title>ShortURL Tool - Track Clicks</title>
        
        <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
        <script defer src='main.js'></script>

        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
        <link rel="manifest" href="site.webmanifest">
    </head>

    <body>
        <header class="account-controls">
            <h1>ShortURL Tool<img src="android-chrome-192x192.png"></h1>
            
            <div id="acc-options-container">
                <a href="login.html">
                    <button id="loginButton">Log in</button>
                </a>
                <a href="signup.html">
                    <button id="signupButton">Sign up</button>
                </a>
            </div>
        </header>
        
        <nav id="global">
            <a href="index.html">Home</a>
            <a href="account.html">Account</a>
        </nav>

        <main id="main-container">
        <h1>Your URL is ready!</h1>
`;
const end = `
    </main>

    <footer>
        <p>
            &copy; 2023 Mo Hudeihed
        </p>
    </footer>

</body>
</html>
`;


app.use(express.static("public"));
app.use(
    express.urlencoded({
        extended: true,
    })
);


app.get("/", (req, res) => {
    res.send('Hi');
});


app.post("/generate", async (req, res) => {

    let long_url = req.body.urlbox;
    const id_length = req.body.alias;
    let generated_id = await get_id(id_length);
    let short_url = await get_long_url(long_url, generated_id);

    res.send(
            `${beginning}
                <p class="hidden" id="long">${long_url}</p>
                <p class="hidden" id="short">${short_url}</p>
                <p class="hidden" id="shortid">${generated_id}</p>
            ${end}`);
    
    // console.log(req.body);
});


async function get_id(id_length){
    const baseURL = new URL(`http://localhost:${process.env.SERVICE_PORT}/`)
    const data = {
        length: id_length
    };

    try {
        const response = await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) 
        {
            throw new Error(`HTTP error!`);
        }
        
        const res = await response.json();
        const id = res["string"];

        // console.log("\nGenerated ID:", id);
        
        return id;
    } 
    catch (error) {
        if(error.message === `HTTP error!`)
        {
            console.log(`\n\tError raised: ${error.message}\n\tStatus: ${error.cause}`);
            return "Failed to generate ID.";
        }

        console.error('Fetch error:', error);
    }
}


async function get_long_url(long_url, custom_id){
    
    const short = redirectionBaseURL + custom_id;
    const data = {
        "long": long_url,
        "shortid": custom_id,
        "short": short
    };

    try 
    {
        const response = await fetch(dbBaseEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(!response.ok)
        {
            throw new Error(`HTTP error!`);
        }

        const res = await response.json();
        // console.log(res);
        
        console.log("Generated short link:", short);
        
        return short;
    }
    catch (error) 
    {
        if(error.message === `HTTP error!`)
        {
            console.log(`\n\tError raised: ${error.message}\n`);
        }
        console.error(error.message, error);
        
        return "Failed to generate short URL. Please try different inputs.";
    }
}


app.get(`/:_shortid`, async (req, res) => {

    const shortid = req.params._shortid; 
    const retrieveByShortIDEndpoint = `${dbBaseEndpoint}/shortid/${shortid}`;

    try 
    {
        const response = await fetch(retrieveByShortIDEndpoint, { headers: {"Content-Type": "application/json"} });
        
        if(!response.ok)
        {
            throw new Error(`HTTP error!`);
        }

        const result = (await response.json())[0];
        
        updateClicks(result);

        res.redirect(result.long);
    }
    catch (error) 
    {
        if(error.message === `HTTP error!`)
        {
            console.log(`\n\tError raised: ${error.message}\n`);
        }
        console.error(error.message, error);
    }
});


async function updateClicks(url)
{
    const updateURLEndpoint = `${dbBaseEndpoint}/${url._id}`;
    let updatedClicks = url.clicks + 1;
    const data = {
        long: url.long,
        shortid: url.shortid,
        short: url.short,
        clicks: updatedClicks,
        dateAdded: url.dateAdded
    }; 

    try 
    {
        const response = await fetch(updateURLEndpoint, { 
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        
        if(!response.ok)
        {
            throw new Error(`Failed to update clicks for ${url._id}`);
        }

        return;
    }
    catch (error) 
    {
        console.log(`\n\tError raised: ${error.message}\n`);
    }
}


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
