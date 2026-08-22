document.addEventListener('DOMContentLoaded', () => {
    const navEx = document.getElementById('navExplanations');
    const navTut = document.getElementById('navTutorials');

    if (navEx) {
        navEx.addEventListener('click', () => {
            loadDocView("Explanations", `
                <div class="docs-container">
                    <h2>TECHNICAL ARCHITECTURE</h2>
                    <p>OFFCHAT operates completely off-grid without reliant DNS, ISP routing, or cellular towers.</p>
                    
                    <h3>1. Physical Layer (LoRa RF)</h3>
                    <p>Utilizes Semtech SX1262 transceivers on ISM bands (868 MHz Europe / 915 MHz Asia).</p>

                    <h3>2. Payload Encryption</h3>
                    <p>Messages are encrypted on-device via AES-256-GCM before broadcast.</p>

                    <h3>3. Satellite Store-and-Forward</h3>
                    <p>Open-source Low Earth Orbit (LEO) satellites pick up packet pulses and re-broadcast them over target ground stations.</p>
                </div>
            `);
        });
    }

    if (navTut) {
        navTut.addEventListener('click', () => {
            loadDocView("Tutorials & Setup", `
                <div class="docs-container">
                    <h2>HARDWARE & FIRMWARE SETUP</h2>
                    
                    <h3>Step 1: Flashing the Heltec V3 Board</h3>
                    <p>Connect the Heltec ESP32 board via USB-C and execute the firmware installer:</p>
                    <div class="code-block">
                        esptool.py --chip esp32s3 --port /dev/ttyUSB0 erase_flash<br>
                        esptool.py --chip esp32s3 write_flash 0x0 offchat_v1.bin
                    </div>

                    <h3>Step 2: Antenna & Power Assembly</h3>
                    <ul>
                        <li>Connect 868/915 MHz IPEX antenna.</li>
                        <li>Plug 5V Solar panel into powerbank USB input.</li>
                        <li>Connect powerbank to Heltec board via USB-C.</li>
                    </ul>
                </div>
            `);
        });
    }
});

function loadDocView(title, htmlContent) {
    document.getElementById('currentRoomTitle').textContent = title;
    const viewport = document.getElementById('mainViewport');
    viewport.innerHTML = htmlContent;
    if (typeof toggleMenu === 'function') toggleMenu();
}
