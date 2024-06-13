const longURLBox = document.getElementById('longURLBox');
const urlCount = document.getElementById('urlCount');

const customurl = document.getElementById('customurl');
const customUrlCount = document.getElementById('customUrlCount');

const customurlbutton = document.getElementById('customurlbutton');

function updateCharacterCount(input, count, minCount=1, maxCount=2048) 
{
    const _input = document.getElementById(input);
    const _count = document.getElementById(count);
    let inputLength = 0;

    if(_input && _count)
    {
        inputLength = _input.value.length
        _count.textContent = _input.value.length; 
    }

    if(inputLength >= minCount && inputLength <= maxCount){
        customurlbutton.disabled = false;
    }
    else 
    {
        customurlbutton.disabled = true;
    }

}

updateCharacterCount(longURLBox, customurl);