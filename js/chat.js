chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const vault = OffCrypto.getVaultLocal();
    const senderName = vault ? vault.callsign : "Local_Node";

    // 1. Prüfen, ob wir im Browser oder in der Desktop-App sind
    if (EnvironmentCheck.isBrowser() && hwInstance.mode === "HARDWARE") {
        addMessageToUI("SYSTEM", "[WARNUNG]: Browser blockiert direkten Hardware-Zugriff. Bitte nutze die lokale Desktop-App!", "error-msg");
        return;
    }

    // 2. Lokalen Satelliten-Status abfragen
    const satStatus = SatelliteUplink.checkSatelliteInView();
    
    // UI-Meldung & Paketvorbereitung
    if (satStatus.inRange) {
        addMessageToUI("SYSTEM", `[SAT_LINK]: ${satStatus.satellite} in Reichweite (${satStatus.elevation}° Elevation). Transmitting...`, "system");
    } else {
        addMessageToUI("SYSTEM", `[NO_SAT]: Kein LEO-Satellit im Sichtfeld. Sende als Direct Ground-Mesh (868 MHz)...`, "system");
    }

    const packet = SatelliteUplink.formatSatPacket(senderName, text);
    addMessageToUI("You (" + senderName + ")", text, "outgoing");
    messageInput.value = '';

    // 3. Übertragungsversuch über das USB-LoRa-Modul
    try {
        const txResult = await hwInstance.transmitPacket(packet);
        addMessageToUI("TX_HARDWARE", `[ACK]: Packet erfolgreich an Modul übergeben. RF-Output aktiv.`, "system");
    } catch (err) {
        addMessageToUI("HARDWARE ERROR", `[TX_FAILED]: ${err.message}`, "error-msg");
    }
});
