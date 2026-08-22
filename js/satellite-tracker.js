const SatelliteUplink = {
    localSatelliteCatalog: [
        { name: "FOSSASAT-1B", noradId: 45115, freqMHz: 868.1, elevationNeeded: 15 },
        { name: "NORBY LEO", noradId: 46494, freqMHz: 433.1, elevationNeeded: 20 },
        { name: "ARMADILLO-LORA", noradId: 43809, freqMHz: 915.0, elevationNeeded: 10 }
    ],

    currentPass: null,

    checkSatelliteInView() {
        const now = Date.now();
        const cycle = (now / 1000) % 5400;

        if (cycle > 0 && cycle < 600) {
            this.currentPass = this.localSatelliteCatalog[0];
            return {
                inRange: true,
                satellite: this.currentPass.name,
                freq: this.currentPass.freqMHz,
                elevation: Math.floor((cycle / 600) * 80)
            };
        }

        this.currentPass = null;
        return { inRange: false };
    },

    formatSatPacket(callsign, payload) {
        return {
            header: "SAT_UPLINK_v1",
            targetSat: this.currentPass ? this.currentPass.name : "DIRECT_BROADCAST",
            crc: Math.floor(Math.random() * 65535).toString(16),
            sender: callsign,
            data: payload
        };
    }
};
