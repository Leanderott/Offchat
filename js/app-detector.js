const EnvironmentCheck = {
    isDesktopApp() {
        const isElectron = typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
        const isTauri = typeof window !== 'undefined' && window.__TAURI__;
        return isElectron || isTauri;
    },

    isBrowser() {
        return !this.isDesktopApp();
    },

    initEnvironmentGuard() {
        if (this.isBrowser()) {
            console.warn("[SYS_WARN] App runs inside standard web browser!");
            this.showBrowserWarning();
        } else {
            console.log("[SYS_OK] Native Desktop environment detected.");
        }
    },

    showBrowserWarning() {
        if (document.querySelector('.browser-warning-banner')) return;
        
        const warningBanner = document.createElement('div');
        warningBanner.className = 'browser-warning-banner';
        warningBanner.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">⚠️ WARNUNG: BROWSER-MODUS ERKANNT</span>
                <p>Bitte lade den lokalen Desktop-Client herunter. Satelliten-Uplink & Direct RF im Browser eingeschränkt.</p>
                <button id="btnDismissWarning">VERSTANDEN (SIMULATION)</button>
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
