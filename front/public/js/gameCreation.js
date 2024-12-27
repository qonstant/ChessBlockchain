// Event listeners for navigation
document.getElementById('createGame').addEventListener('click', function () {
    const code = document.getElementById('codeInput').value;
    if (code) {
        window.location.replace(`/white?code=${code}`);
    } else {
        document.getElementById('errorMessage').textContent = 'Please enter a code.';
    }
});

document.getElementById('joinGame').addEventListener('click', function () {
    const code = document.getElementById('codeInput').value;
    if (code) {
        window.location.replace(`/black?code=${code}`);
    } else {
        document.getElementById('errorMessage').textContent = 'Please enter a code.';
    }
});

// Handle error display if URL contains error parameter
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('error') === 'invalidCode') {
    document.getElementById('errorMessage').textContent = 'Invalid invite code';
}