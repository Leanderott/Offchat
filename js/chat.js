const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const modeSelect = document.getElementById('modeSelect');
const btnConnectHW = document.getElementById('btnConnectHW');
const hardwareDot = document.getElementById('hardwareDot');
const modeStatusText = document.getElementById('modeStatusText');

modeSelect.addEventListener('change', (e) => {
    const selectedMode = e.target.value;
    hwInstance.setMode(selectedMode);
    
    if (selectedMode === "SIMULATION") {
        modeStatusText.textContent = "Status: Simulation Engine Active (Testing Mode)";
        hardwareDot.className = "status-dot simulation";
    } else {
        modeStatusText.textContent = hwInstance.isConnected ? "Status: Connected to LoRa Hardware" : "Status: Awaiting USB Hardware...";
        hardwareDot.className = hwInstance.isConnected ? "status-dot online" : "status-dot offline";
    }
});

btnConnectHW.addEventListener('click', async () => {
    const success = await hwInstance.connectSerial();
    if (success) {
        hardwareDot.className = "status-dot online";
        modeStatusText.textContent = "Status: HELTEC ESP32 connected via USB Serial";
        document.getElementById('nodeHeltec').classList.add('active');
        document.getElementById('lineSerial').classList.add('active');
    } else {
        alert("Verbindung fehlgeschlagen! Stelle sicher, dass dein LoRa-Modul per USB angeschlossen ist.");
    }
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const vault = OffCrypto.getVaultLocal();
    const senderName = vault ? vault.callsign : "Local_Node";

    if (EnvironmentCheck.isBrowser() && hwInstance.mode === "HARDWARE" && !hwInstance.isConnected) {
        addMessageToUI("SYSTEM", "[WARNUNG]: Webbrowser erfordert expliziten USB-Serial Zugriff. Bitte klicke 'CONNECT LORA MODULE'.", "error-msg");
        return;
    }

    const satStatus = SatelliteUplink.checkSatelliteInView();
    
    if (satStatus.inRange) {
        addMessageToUI("SYSTEM", `[SAT_LINK]: ${satStatus.satellite} in Reichweite (${satStatus.elevation}° Elevation). Transmitting...`, "system-msg");
        document.getElementById('nodeSat').classList.add('active');
    } else {
        addMessageToUI("SYSTEM", `[NO_SAT]: Kein Satellit im Sichtfeld. Sende als Direct Ground-Mesh...`, "system-msg");
    }

    const packet = SatelliteUplink.formatSatPacket(senderName, text);
    addMessageToUI("You (" + senderName + ")", text, "outgoing");
    messageInput.value = '';

    try {
        const result = await hwInstance.transmitPacket(packet);
        
        document.getElementById('nodeBrowser').classList.add('active');
        document.getElementById('lineSerial').classList.add('active');
        document.getElementById('nodeHeltec').classList.add('active');
        document.getElementById('lineRF').classList.add('active');
        document.getElementById('nodePeerBox').classList.add('active');

        if (result.rssi) {
            document.getElementById('rfMetrics').textContent = `RSSI: ${result.rssi}dBm | SNR: ${result.snr}dB`;
        }
        
        addMessageToUI("SYSTEM", `[TX_OK]: Packet successfully dispatched over RF.`, "system-msg");
    } catch (error) {
        addMessageToUI("RF HARDWARE ERROR", `[FAILED]: ${error.message}`, "error-msg");
        document.getElementById('lineRF').classList.remove('active');
        document.getElementById('nodePeerBox').classList.remove('active');
    }
});

function addMessageToUI(sender, text, type) {
    if (!roomsData[currentActiveRoom]) roomsData[currentActiveRoom] = [];
    roomsData[currentActiveRoom].push({ sender, text, type });
    loadMessagesForRoom(currentActiveRoom);
}

window.addEventListener("lora_msg_received", (e) => {
    const packet = e.detail;
    addMessageToUI(packet.sender, packet.data, "incoming");
});
