class HardwareInterface {
    constructor() {
        this.port = null;
        this.writer = null;
        this.reader = null;
        this.isConnected = false;
        this.mode = "HARDWARE";
    }

    setMode(newMode) {
        this.mode = newMode;
        console.log(`[SYS] Execution mode switched to: ${this.mode}`);
    }

    async connectSerial() {
        if (!("serial" in navigator)) {
            alert("WebSerial wird in deinem Browser nicht unterstützt!");
            return false;
        }

        try {
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 115200 });

            this.writer = this.port.writable.getWriter();
            this.reader = this.port.readable.getReader();
            this.isConnected = true;

            this.listenToHardware();
            return true;
        } catch (err) {
            console.error("[SERIAL ERR]", err);
            this.isConnected = false;
            return false;
        }
    }

    async listenToHardware() {
        const decoder = new TextDecoder();
        let buffer = "";

        while (this.isConnected && this.port.readable) {
            try {
                const { value, done } = await this.reader.read();
                if (done) break;

                buffer += decoder.decode(value);
                let lines = buffer.split("\n");
                buffer = lines.pop();

                for (let line of lines) {
                    this.handleIncomingRawLine(line.trim());
                }
            } catch (error) {
                console.error("[SERIAL READ ERR]", error);
                break;
            }
        }
    }

    async transmitPacket(payload) {
        if (this.mode === "HARDWARE") {
            if (!this.isConnected || !this.writer) {
                throw new Error("ERR_NO_HARDWARE: Modul nicht über WebSerial verbunden!");
            }
            const encoder = new TextEncoder();
            const data = JSON.stringify(payload) + "\n";
            await this.writer.write(encoder.encode(data));
            return { status: "TX_SENT_TO_LORA_BOARD" };
        } else {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.25) {
                        reject(new Error("SIM_ERR_PACKET_COLLISION: RF-Kollision auf Channel 868.1 MHz"));
                    } else {
                        resolve({ status: "SIM_ACK_DELIVERED", rssi: -84, snr: 7.2 });
                    }
                }, 1200);
            });
        }
    }

    handleIncomingRawLine(rawLine) {
        try {
            const parsed = JSON.parse(rawLine);
            if (parsed.type === "RX_LORA_PACKET") {
                window.dispatchEvent(new CustomEvent("lora_msg_received", { detail: parsed }));
            }
        } catch (e) {
            console.log("[LORA RAW LOG]", rawLine);
        }
    }
}

const hwInstance = new HardwareInterface();
