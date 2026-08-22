const chatForm = document.getElementById('chatForm');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (text === '') return;

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    // Nachricht im Datenmodell des aktuellen Raums speichern
    const newMsg = {
        sender: "You (Germany)",
        text: text,
        type: "outgoing",
        time: timeStr
    };

    if (!roomsData[currentActiveRoom]) {
        roomsData[currentActiveRoom] = [];
    }
    
    roomsData[currentActiveRoom].push(newMsg);

    // Chat-Verlauf aktualisieren
    loadMessagesForRoom(currentActiveRoom);

    input.value = '';
});

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
