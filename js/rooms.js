// Struktur der Räume mit Beispiel-Nachrichten
const roomsData = {
    "General": [
        { sender: "SYSTEM", text: "Connected to OFFCHAT global mesh relay.", type: "system", time: "10:00" },
        { sender: "Singapore_Node", text: "Hey! Signal strength is optimal over South East Asia.", type: "incoming", time: "10:02" }
    ],
    "Europe": [
        { sender: "Germany_Node_01", text: "Europe channel active on 868 MHz.", type: "incoming", time: "09:45" }
    ],
    "Asia": [
        { sender: "Singapore_Node", text: "Singapore LEO satellite pass expected soon.", type: "incoming", time: "10:15" }
    ],
    "North America": [
        { sender: "US_West_Node", text: "Listening on 915 MHz band.", type: "incoming", time: "08:30" }
    ],
    "South America": [
        { sender: "Brazil_Node", text: "No active satellite pass currently.", type: "incoming", time: "07:12" }
    ],
    "Africa": [
        { sender: "Cairo_Node", text: "Relay standby.", type: "incoming", time: "09:11" }
    ],
    "Oceania": [
        { sender: "Sydney_Node", text: "Oceania mesh test online.", type: "incoming", time: "11:00" }
    ],
    "Antarctica": [
        { sender: "Polar_Station", text: "Listening on emergency packet frequency.", type: "incoming", time: "04:20" }
    ]
};

let currentActiveRoom = "General";

const roomListElement = document.getElementById('roomList');
const currentRoomTitle = document.getElementById('currentRoomTitle');
const messageInput = document.getElementById('messageInput');

// Rendert die Liste in der Sidebar
function renderRooms() {
    roomListElement.innerHTML = '';
    
    Object.keys(roomsData).forEach(roomName => {
        const li = document.createElement('li');
        li.className = `room-item ${roomName === currentActiveRoom ? 'active' : ''}`;
        li.innerHTML = `<span class="glow-text"># ${roomName}</span>`;
        
        // Klick-Event für den Raumwechsel
        li.addEventListener('click', () => {
            switchRoom(roomName);
            if (typeof toggleMenu === 'function') toggleMenu();
        });

        roomListElement.appendChild(li);
    });
}

// Schaltet den aktiven Raum um
function switchRoom(roomName) {
    currentActiveRoom = roomName;
    currentRoomTitle.textContent = `# ${roomName}`;
    messageInput.placeholder = `Write an encrypted message to #${roomName}...`;
    
    renderRooms();
    loadMessagesForRoom(roomName);
}

// Laedt Nachrichten des gewaehlten Raums
function loadMessagesForRoom(roomName) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    const messages = roomsData[roomName] || [];
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.type}`;
        
        if (msg.type === 'system') {
            msgDiv.textContent = msg.text;
        } else {
            msgDiv.innerHTML = `
                <div class="msg-meta">
                    <span class="sender">${msg.sender}</span>
                    <span class="time">${msg.time}</span>
                </div>
                <div class="msg-body">${escapeHTML(msg.text)}</div>
            `;
        }
        
        chatMessages.appendChild(msgDiv);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    renderRooms();
    loadMessagesForRoom(currentActiveRoom);
});
