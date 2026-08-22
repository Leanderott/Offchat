document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('overlay');

    const authModal = document.getElementById('authModal');
    const btnAuth = document.getElementById('btnAuth');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCreateAccount = document.getElementById('btnCreateAccount');
    
    const accountName = document.getElementById('accountName');
    const accountKey = document.getElementById('accountKey');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    window.toggleMenu = toggleMenu;

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    if (btnAuth) {
        btnAuth.addEventListener('click', () => {
            authModal.classList.add('active');
        });
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            authModal.classList.remove('active');
        });
    }

    if (btnCreateAccount) {
        btnCreateAccount.addEventListener('click', async () => {
            const username = document.getElementById('usernameInput').value.trim();
            const pin = document.getElementById('pinInput').value.trim();

            if (!username || !pin) {
                alert("Bitte Nickname und PIN eingeben!");
                return;
            }

            const identity = await OffCrypto.generateIdentity();
            const vault = OffCrypto.saveVaultLocal(username, identity.pubKeyHex, pin);

            updateAccountUI(vault);
            authModal.classList.remove('active');
        });
    }

    function updateAccountUI(vault) {
        if (vault) {
            accountName.textContent = vault.callsign;
            accountKey.textContent = `KEY: ${vault.pubKey}`;
        }
    }

    const savedVault = OffCrypto.getVaultLocal();
    if (savedVault) {
        updateAccountUI(savedVault);
    }
});
