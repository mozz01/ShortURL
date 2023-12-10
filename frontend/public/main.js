const customElements = document.querySelectorAll(".customText");
const customButton = document.getElementById("custom");
try 
{
    customButton.addEventListener("mouseenter", function() {
        customElements.forEach(function(element){
            console.log(`Show customElements`);
            element.style.display = "block";
        })
    });
    
    customButton.addEventListener("mouseleave", function() {
    customElements.forEach(function(element){
            console.log(`Hide customElements`);
            element.style.display = "none";
        })
    });

} 
catch (err) 
{
    console.log("Caught error: " + err);
}



const toggleButton = document.getElementById("toggle-hidden");
const hiddenElements = document.querySelectorAll(".hidden");
try 
{
    toggleButton.addEventListener("click", function() {
        hiddenElements.forEach(function(element){
            if (element.style.display === "none" || element.style.display === ""){
                console.log("Show");
                element.style.display = "block";
            }
            else{
                console.log("Hide");
                element.style.display = "none";
            }
        })
    });
} 
catch (err) 
{
    console.log("Caught error: " + err);
}



const copyButton = document.getElementById("copyButton");
const urlbox = document.getElementById("urlbox");
try 
{
    copyButton.addEventListener("click", function(){
        urlbox.select();
        val = urlbox.value;
    
        navigator.clipboard.writeText(val);
    
        console.log("Copied to clipboard: " + val);
    })
} 
catch (err) 
{
    console.log("Caught error: " + err);
}


const long_url = document.getElementById('long');
const short_url = document.getElementById('short'); 
const shortid = document.getElementById('shortid');

const mainContainer = document.getElementById('main-container');

// creating elements
const paragraphElement = document.createElement('p');
const longUrlContainer = document.createElement('p');
const shortUrlHeader = document.createElement('h3');
const longUrlHeader = document.createElement('h3');
const breakLine = document.createElement('br');
const shortUrlContainer = document.createElement('div');
const copyShortUrlButton = document.createElement('button');
const trackClicksButton = document.createElement('button');
const trackClicksButtonAnchor = document.createElement('a');
const buttonsContainer = document.createElement('div');

// assigning values and attributes
shortUrlHeader.innerText = 'Your short URL is:';
longUrlHeader.innerText = 'Your long URL is:';
shortUrlContainer.innerText = short_url.innerText;
shortUrlContainer.id = 'shortUrlContainer';
copyShortUrlButton.type = 'button';
copyShortUrlButton.class = 'options';
copyShortUrlButton.innerText = 'Copy Short URL';
trackClicksButton.type = 'button';
trackClicksButton.class = 'options';
trackClicksButton.innerText = 'Track Clicks';
trackClicksButtonAnchor.href = `track.html?shortid=${shortid.innerText}`;
longUrlContainer.innerText = long_url.innerText;
buttonsContainer.id = 'buttonsContainer';

// Rearranging element
trackClicksButtonAnchor.appendChild(trackClicksButton);
paragraphElement.appendChild(longUrlHeader);
paragraphElement.appendChild(longUrlContainer);
paragraphElement.appendChild(shortUrlHeader);
paragraphElement.appendChild(shortUrlContainer);
buttonsContainer.appendChild(copyShortUrlButton);
buttonsContainer.appendChild(trackClicksButtonAnchor);
mainContainer.appendChild(paragraphElement);
mainContainer.appendChild(buttonsContainer);

mainContainer.removeChild(long_url);
mainContainer.removeChild(short_url);
mainContainer.removeChild(shortid);

try 
{
    copyShortUrlButton.addEventListener("click", function(){
        let val = shortUrlContainer.innerText;
    
        navigator.clipboard.writeText(val);
    
        console.log("Copied to clipboard: " + val);
    })
}
catch (err) 
{
    console.log("Caught error: " + err);
}



const loginButton = document.getElementById("loginButton");
// loginButton.addEventListener("click", function(){
//     window.location.href = "login.html";
// })

// signupButton.addEventListener("click", function(){
//     window.location.href = "signup.html";
// })