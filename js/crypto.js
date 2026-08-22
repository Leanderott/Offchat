const OffCrypto = {
    async generateIdentity() {
        const keyPair = await window.crypto.subtle.generateKey(
            { name: "ECDSA", namedCurve: "P-256" },
            true,
            ["sign", "verify"]
        );

        const rawPubKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const pubKeyHex = this.buf2hex(rawPubKey).substring(0, 12);

        return {
            keyPair,
            pubKeyHex
        };
    },

    saveVaultLocal(callsign, pubKeyHex, pin) {
        const vaultData = {
            callsign: callsign,
            pubKey: pubKeyHex,
            created: Date.now()
        };
        localStorage.setItem("offchat_vault", JSON.stringify(vaultData));
        return vaultData;
    },

    getVaultLocal() {
        const data = localStorage.getItem("offchat_vault");
        return data ? JSON.parse(data) : null;
    },

    buf2hex(buffer) {
        return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
    }
};
