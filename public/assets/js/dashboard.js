document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar-wrapper');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        const isMenuOpen = sidebar.classList.toggle('show');
        overlay.style.display = isMenuOpen ? 'block' : 'none';
        // O botão será oculto ou mostrado com base na visibilidade do menu
    }

    function closeMenu() {
        sidebar.classList.remove('show');
        overlay.style.display = 'none';
        // O botão será mostrado automaticamente quando o menu estiver fechado
    }

    function handleOverlayClick() {
        closeMenu();
    }

    function handleDocumentClick(e) {
        if (sidebar.classList.contains('show') && !sidebar.contains(e.target) && e.target !== menuToggle) {
            closeMenu();
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('click', handleDocumentClick);
});
