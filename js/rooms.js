// Struktur aller Räume nach Kontinenten
const chatRooms = [
    { name: "General", group: "GLOBAL" },
    { name: "Europe", group: "CONTINENTS" },
    { name: "Asia", group: "CONTINENTS" },
    { name: "North America", group: "CONTINENTS" },
    { name: "South America", group: "CONTINENTS" },
    { name: "Africa", group: "CONTINENTS" },
    { name: "Oceania", group: "CONTINENTS" },
    { name: "Antarctica", group: "CONTINENTS" }
];

const roomListElement = document.getElementById('roomList');
const currentRoomTitle = document.getElementById('currentRoomTitle');

// Räume in der Sidebar anzeigen
function renderRooms() {
    roomListElement.innerHTML = '';
    
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.className = 'room-item';
        li.innerHTML = `<span class="glow-text"># ${room.name}</span>`;
        
        li.addEventListener('click', () => {
            currentRoomTitle.textContent = `# ${room.name}`;
            // Menü schließen nach Auswahl auf Mobilgeräten
            if (typeof toggleMenu === 'function') toggleMenu();
        });

        roomListElement.appendChild(li);
    });
}

// Beim Laden ausführen
document.addEventListener('DOMContentLoaded', renderRooms);
