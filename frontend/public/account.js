let allURLs = [];

async function fetchAllURLs(){
    const response = await fetch('http://localhost:8000/retrieveall', { 
        headers: {"Content-Type": "application/json"},
        method: "GET"
    })

    if(!response.ok)
    {
        console.log("Couldn't fetch URLs");
        return;
    }

    const urls = await response.json();
    allURLs = urls;
    loadURLs(urls);
}


const tableBody = document.getElementById('tableBody');

function loadURLs(urls){
    urls.forEach(url => {
        tableBody.innerHTML += `
            <tr>
                <td>
                    <label>
                        <input type="checkbox" class="urlCheckbox" value="${url._id}">
                        <span></span>
                    </label>
                </td>
                
                <td>
                    <a href="${url.short}" target="_blank" rel="noopener noreferrer" class="tableLink">
                        <div class="shortURLContainer">${url.short}</div>
                    </a>
                </td>
                <td>
                    <a href="${url.long}" target="_blank" rel="noopener noreferrer" class="tableLink">
                        <div class="longURLContainer">${url.long}</div>
                    </a>
                </td>

                <td>${url.clicks}</td>
            </tr>`;
    }); 
}


function execCopy(val){
    navigator.clipboard.writeText(val);
}

const deactivateURLButton = document.getElementById('deactivateURLButton');
const visitTrackingPage = document.getElementById('visitTrackingPage');
const communicationParagraph = document.getElementById('communicationParagraph');

async function deactivateSelected(event){
    event.preventDefault();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const checkboxValues = Array.from(checkboxes).map(checkbox => checkbox.value);

    if(checkboxValues.length < 1)
    {
        alert("Please select at least one URL to deactivate.");
        return;
    }

    const data = {
        ids: checkboxValues
    };


    console.log(checkboxValues);

    try
    {   
        // This variable 'awaits' and 'fetches' the response from the URL
        const response = await fetch('http://localhost:8000/deactivate', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        // catch unsuccessful respones
        if (!response.ok) 
        {
            throw new Error(`HTTP error!`);
        }
        
        communicationParagraph.innerHTML = `Success!`;

        // One second delay until the database is updated
        setTimeout( () => {
            tableBody.innerHTML = '';
            fetchAllURLs();
        }, 1000);
    }
    catch(err)
    {
        communicationParagraph.innerHTML = `The request was not successful.`;
        console.log("Error caught:", err.message);
    }
}


function loadTrackingPage(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const checkboxValues = Array.from(checkboxes).map(checkbox => checkbox.value);

    if(checkboxValues.length !== 1)
    {
        alert("Please select one URL to visit its clicks tracking page.");
        return;
    }

    let targetURL = {};

    allURLs.forEach(URL => {
        if(URL._id === checkboxValues[0])
        {
            targetURL = URL;
        }
    });

    if(targetURL)
    {
        const shortid = targetURL.shortid;
        window.open(`http://localhost:8000/track.html?shortid=${shortid}`, "_blank");
    }
}

deactivateURLButton.addEventListener('click', deactivateSelected);
visitTrackingPage.addEventListener('click', loadTrackingPage);

fetchAllURLs();