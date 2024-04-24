
async function sendData(event, apiPath) {
    event.preventDefault();
    const question = document.getElementById('question').value;
    const jsonData = document.getElementById('jsonData').value;
    document.getElementById('response').innerText = 'Loading...';

    const response = await fetch(apiPath + '/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, jsonData })
    });
    const data = await response.json();
    if (data.message == "ok") {

        await fetch(apiPath + '/addUserQuestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        document.getElementById('response').innerText = '';

        const eventSource = new EventSource(apiPath + '/stream');
        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            const outputDiv = document.getElementById('response');
            outputDiv.innerHTML += `${data.message}`; // Append new messages
        };
        eventSource.onerror = function (error) {
            console.log('EventSource failed:', error);
            eventSource.close();
        };
    }
    else {
        document.getElementById('response').innerText = 'error';
    }
}
