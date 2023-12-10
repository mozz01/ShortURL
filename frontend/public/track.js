const queryParameters = new URLSearchParams(window.location.search);
const shortid = queryParameters.get('shortid');

const container = document.getElementById('tracking-container');
const clicksContainer = document.getElementById('clicksContainer');
const shortURLHolder = document.getElementById('shortURLHolder');

let urlObject = 0;
let isValidURL = false;

async function getURL(){
    if(shortid.length > 5)
    {
        const response = await fetch(`http://localhost:3001/urls/shortid/${shortid}`, {
            headers: {"Content-Type": "application/json"}
        });

        const result = (await response.json())[0];

        isValidURL = true;
        return result;
    }
}

async function getClicks()
{   
    urlObject = await getURL();
    
    if(isValidURL)
    {
        shortURLHolder.innerText = urlObject.short;
        clicksContainer.innerText = urlObject.clicks;    
    }
}


function copyShortURL(){
    if(isValidURL)
    {
        const val = urlObject.short;
        navigator.clipboard.writeText(val);
    
        console.log("Copied to clipboard: " + val);
    }
}


getClicks();