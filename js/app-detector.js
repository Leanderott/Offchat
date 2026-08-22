// Prüft, ob das Programm als lokale Desktop-App oder im normalen Browser läuft
const EnvironmentCheck = {
    isDesktopApp() {
        // Testet auf Node.js / Electron / Tauri Umgebung
        const isElectron = typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
        const isTauri = typeof window !== 'undefined' && window.__TAURI__;
        return isElectron || isTauri;
    },

    isBrowser() {
        return !this.isDesktopApp();
    },

    initEnvironmentGuard() {
        if (this.isBrowser()) {
            console.warn("[SYS_WARN] App läuft im normalen Browser! Einschränkungen aktiv.");
            this.showBrowserWarning();
        } else {
            console.log("[SYS_OK] Lokaler Desktop-Client erkannt. Vollzugriff auf HF-Schnittstellen.");
        }
    },

    showBrowserWarning() {
        const warningBanner = document.createElement('div');
        warningBanner.className = 'browser-warning-banner';
        warningBanner.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">⚠️ WARNUNG: BROWSER-MODUS ERKANNT</span>
                <p>Du führst OFFCHAT im Webbrowser aus. Direkter Satelliten-Uplink & Offline-Keyvault sind eingeschränkt.</p>
                <button id="btnDismissWarning">VERSTANDEN (NUR SIMULATION)</button>
            </div>
        `;
        document.body.prepend(warningBanner);

        document.getElementById('btnDismissWarning').addEventListener('click', () => {
            warningBanner.remove();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    EnvironmentCheck.initEnvironmentGuard();
});
