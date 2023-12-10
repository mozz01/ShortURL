function updateCharacterCount(inputId, countId) 
{
    const input = document.getElementById(inputId);
    const count = document.getElementById(countId);

    if (input && count) 
    {
        count.textContent = input.value.length;
    }
}