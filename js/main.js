// Elemente aus dem HTML laden
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// Funktion zum Öffnen/Schließen des Menüs
function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Event Listener für den Klick auf den Drei-Striche-Button
menuToggle.addEventListener('click', toggleMenu);

// Menü schließen, wenn man irgendwo auf den abgedunkelten Hintergrund klickt
overlay.addEventListener('click', toggleMenu);
