<script>
    document.getElementById('logout').addEventListener('click', function (e) {
        e.preventDefault();

        // Remover token de autenticação armazenado (se estiver usando localStorage ou sessionStorage)
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        // Redirecionar para a página de login
        window.location.href = '/login';
    });
</script>
