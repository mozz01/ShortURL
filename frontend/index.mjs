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
                    <button id="loginButton" class="account-options">Log in</button>
                </a>
                <a href="signup.html">
                    <button id="signupButton" class="account-options">Sign up</button>
                </a>
            </div>
        </header>
        
        <nav id="global">
            <a href="index.html">Home</a>
            <a href="account.html">Account</a>
        </nav>

        <main id="main-container">
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


// Generate a short URL with a random ID whose length is set by user
app.post("/generate", async (req, res) => {
    let long_url = req.body.urlbox;

    try
    {
        // Validating before generating short URL
        if(! (await validateURL(long_url)) )
        {
            throw new Error(`The provided link "${long_url}" is invalid or is not reachable. Unable to geterate short URL.`);
        }
        
        // Capturing the length of the short URL
        const id_length = req.body.alias;

        let generated_id = await getShortID(id_length);
        let short_url = await getCompleteShortURL(long_url, generated_id);
        
        console.log("Short URL is ready. Sending response back to user.");
        res.send(
                `${beginning}
                    <h1>Your URL is ready!</h1>
                    <p class="hidden" id="long">${long_url}</p>
                    <p class="hidden" id="short">${short_url}</p>
                    <p class="hidden" id="shortid">${generated_id}</p>
                ${end}`);
    }
    catch(error)
    {
        console.error(`Error raised:\n\n\t${error.message}\n\n\t${error}\n`);
        
        res.send(
            `${beginning}
                <h2>${error.message}</h2>
                <a href="index.html"><button>Go to Homepage</button></a>
            ${end}`);
    }
});


// Request a short URL with a custom ID
app.post('/customurl', async (req, res) => {
    const customID = req.body.customurl;
    const long_url = req.body.urlbox;

    try
    {
        if(! (await validateURL(long_url)) )
        {
            throw new Error(`The provided link "${long_url}" is invalid or is not reachable. Unable to geterate short URL.`);
        }
    
        let short_url = await getCompleteShortURL(long_url, customID);
        
        res.send(
                `${beginning}
                    <h1>Your URL is ready!</h1>
                    <p class="hidden" id="long">${long_url}</p>
                    <p class="hidden" id="short">${short_url}</p>
                    <p class="hidden" id="shortid">${customID}</p>
                ${end}`);
    
    }
    catch(error)
    {
        console.error(`Error raised:\n\n\t${error.message}\n\n\t${error}\n`);
        
        res.send(
            `${beginning}
                <h2>${error.message}</h2>
                <a href="index.html"><button>Go to Homepage</button></a>
            ${end}`);
    }
});


// Request a randomized string from the microservice
async function getShortID(id_length){
    const baseURL = new URL(`http://localhost:${process.env.SERVICE_PORT}/`)
    const data = {
        length: id_length
    };

    try {
        // Send POST request to the microservice
        const response = await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Check response status
        if (!response.ok) 
        {
            throw new Error(`HTTP error!`);
        }
        
        const res = await response.json();
        const id = res["string"];

        // Return the generated random string
        console.log("Generated short URL ID:", id);
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


// Updates the database with the URL information 
async function getCompleteShortURL(long_url, custom_id)
{
    // Assembling short URL
    const short = redirectionBaseURL + custom_id;
    const data = {
        "long": long_url,
        "shortid": custom_id,
        "short": short
    };

    try 
    {
        // Creating a new URL information entry
        const response = await fetch(dbBaseEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(!response.ok)
        {
            throw new Error(`Failed to reach the database while creating new URL.`);
        }

        console.log("Added URL information to the database successfully.");
        return short;
    }
    catch (error) 
    {
        if(error.message === `Failed to reach the database while creating new URL.`)
        {
            console.error(`Error raised:\n\n\t${error.message}\n\n\t${error}\n`);
        }
        
        return false;
    }
}


// Invoked when a short URL is used to redirect trafic to the long URL
app.get(`/:_shortid`, async (req, res) => {

    const shortid = req.params._shortid; 
    const retrieveByShortIDEndpoint = `${dbBaseEndpoint}/shortid/${shortid}`;

    try 
    {
        const response = await fetch(retrieveByShortIDEndpoint, { headers: {"Content-Type": "application/json"} });
        
        if(!response.ok)
        {
            throw new Error(`Failed to reach the database while retrieving long URL.`);
        }
        const result = (await response.json())[0];
        
        updateClicks(result);

        res.redirect(result.long);
    }
    catch (error) 
    {
        if(error.message === `Failed to reach the database while retrieving long URL.`)
        {
            console.error(`Error raised:\n\n\t${error.message}\n\n\t${error}\n`);
        }
        console.error(error.message, error);
    }
});


// Checks long URL input, adds potocol if needed, and pings the URL to see if responsive
async function validateURL(targetURL)
{
    const urlPattern = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;
    const urlBeninning = /^(http(s)?:\/\/)/;
    let pingURL = targetURL;

    // Check URL pattern for validity
    const isValid = urlPattern.test(targetURL);
    // console.log(`${targetURL}: ${isValid ? 'Valid' : 'Invalid'} URL`);
    
    if(!isValid)
    {
        return false;
    }

    if(!urlBeninning.test(targetURL))
    {
        pingURL = 'https://' + targetURL;
    }

    // Ping URL to check for responsiveness
    const response = await fetch(pingURL, {
        mode: 'no-cors'
    });

    console.log("Long URL validation completed.");
    return response.ok;
}


// Used for tracking visit to generated short URLs
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
        // Update count in the database
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
