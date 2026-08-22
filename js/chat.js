const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');

// Funktion zum Absenden einer Nachricht
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (text === '') return;

    // Neue Nachricht im UI erstellen
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message outgoing';
    msgDiv.innerHTML = `
        <span class="sender">You (Germany):</span>
        ${escapeHTML(text)}
    `;

    // Zum Verlauf hinzufügen
    chatMessages.appendChild(msgDiv);

    // Eingabe leeren und nach unten scrollen
    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Sicherheit: HTML-Code in Nachrichten neutralisieren
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
