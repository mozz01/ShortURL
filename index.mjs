"use strict";

import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PROJECT_PORT;
const redirectURL = `http://localhost:${PORT}/redirect/`;

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
    let beginning = `
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
    let end = `
        </main>

        <footer>
            <p>
                &copy; 2023 Mo Hudeihed
            </p>
        </footer>

    </body>
    </html>
    `;

    
    let long_url = req.body.urlbox;
    const id_length = req.body.alias;
    let generated_id = await get_id(id_length);
    let short_url = await get_long_url(long_url, generated_id);

    res.send(
            `${beginning}
                <p class="hidden" id="long">${long_url}</p>
                <p class="hidden" id="short">${short_url}</p>
            ${end}`);
    
    console.log(req.body);
});


async function get_id(id_length){
    const baseURL = new URL("http://localhost:8000/")
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
            throw new Error(`HTTP error!`, {cause: `${response.status}`});
        }
        
        const res = await response.json();
        const id = res["string"];

        console.log("\nGenerated ID:", id);
        
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
    
    let short = redirectURL + custom_id;

    try 
    {
        console.log("Generated short link:", short);
        
        return short;
    }
    catch (error) 
    {
        console.error('Redirection error:', error);
        
        return "Failed to generate short URL. Please try different inputs.";
    }
}


app.get(`redirect/:id`, (req, res) => {

    console.log("id:", id);

    res.redirect("https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected");

});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});




/*
https://is.gd/apishorteningreference.php
https://is.gd/usagelimits.php



const baseURL = new URL("https://is.gd/create.php")
    baseURL.searchParams.set('format', 'json');
    // baseURL.searchParams.set('logstats', '1');
    baseURL.searchParams.set('url', long_url);
    baseURL.searchParams.set('shorturl', custom_id);    

    try {    

        const response = await fetch(baseURL, {
            method: "POST"
        });

        if (!response.ok) 
        {
            throw new Error(`HTTP error!`, {cause: `${response.status}`});
        }
        
        const res = await response.json();

        if( res.errorcode ){
            throw new Error(`Bad short URL`, { cause: JSON.stringify(res) });
        }
        const short = res.shorturl;

        console.log("Generated short link:", short);
        
        return short;
    }
    catch (error) {
        if(error.message === `HTTP error!`)
        {
            console.log(`\n\tError raised: ${error.message}\n\tStatus: ${error.cause}`);
        }
        else if(error.message === `Bad short URL`)
        {
            console.log(`\n\tError raised: ${error.message}\n\tCause: ${error.cause}`);
        }
        else
        {
            console.error('Fetch error:', error);
        }
        
        return "Failed to generate short URL. Please try different inputs.";
    }
*/

