const roomsData = {
    "General": [
        { sender: "SYSTEM", text: "P2P Mesh initialized. Searching for LEO satellites...", type: "system-msg" }
    ],
    "Europe": [],
    "Asia": [],
    "North America": [],
    "Antarctica": []
};

let currentActiveRoom = "General";
const roomListElement = document.getElementById('roomList');
const currentRoomTitle = document.getElementById('currentRoomTitle');

function renderRooms() {
    if (!roomListElement) return;
    roomListElement.innerHTML = '';
    
    Object.keys(roomsData).forEach(roomName => {
        const li = document.createElement('li');
        li.className = `room-item ${roomName === currentActiveRoom ? 'active' : ''}`;
        li.innerHTML = `<span class="glow-text"># ${roomName}</span>`;
        
        li.addEventListener('click', () => {
            switchRoom(roomName);
            if (typeof toggleMenu === 'function') toggleMenu();
        });

        roomListElement.appendChild(li);
    });
}

function switchRoom(roomName) {
    currentActiveRoom = roomName;
    currentRoomTitle.textContent = `# ${roomName}`;
    
    const mainViewport = document.getElementById('mainViewport');
    if (!document.getElementById('chatMessages')) {
        mainViewport.innerHTML = `<div class="chat-messages" id="chatMessages"></div>`;
    }

    renderRooms();
    loadMessagesForRoom(roomName);
}

function loadMessagesForRoom(roomName) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    chatMessages.innerHTML = '';

    const messages = roomsData[roomName] || [];
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.type}`;
        msgDiv.textContent = msg.type === 'system-msg' || msg.type === 'error-msg' ? msg.text : `${msg.sender}: ${msg.text}`;
        chatMessages.appendChild(msgDiv);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    renderRooms();
    loadMessagesForRoom(currentActiveRoom);
});
