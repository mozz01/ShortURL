const queryParameters = new URLSearchParams(window.location.search);
const shortid = queryParameters.get('shortid');

const container = document.getElementById('tracking-container');
const clicksContainer = document.getElementById('clicksContainer');
const shortURLHolder = document.getElementById('shortURLHolder');

async function getClicks()
{

    const response = await fetch(`http://localhost:3001/urls/shortid/${shortid}`, {
        headers: {"Content-Type": "application/json"}
    });

    const result = (await response.json())[0];
    console.log("shortid:", shortid);

    shortURLHolder.innerText = result.short;
    clicksContainer.innerText = result.clicks;
}

getClicks();