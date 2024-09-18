document.getElementById('registerCompanyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cnpj = document.getElementById('cnpj').value;
    const name = document.getElementById('name').value;

    fetch('/register-company', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cnpj, name })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Empresa registrada com sucesso') {
            // Redirecionar para outra página ou mostrar mensagem de sucesso
            window.location.href = '/dashboard';
        }
    })
    .catch(error => console.error('Erro:', error));
});
