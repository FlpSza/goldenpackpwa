document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o envio do formulário padrão

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Armazena o token no localStorage
            window.location.href = '/dashboard'; // Redireciona para o dashboard
        } else {
            const error = await response.json();
            alert(error.message); // Mostra mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao enviar o login:', error);
    }
});

// Exemplo de fetch para endpoint protegido
async function loadEmpresas() {
    try {
        const response = await fetch('/empresas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluindo o token
            }
        });

        if (response.ok) {
            const empresas = await response.json();
            const select = document.getElementById('empresaSelect');
            empresas.forEach(empresa => {
                const option = document.createElement('option');
                option.value = empresa.id;
                option.textContent = empresa.nome;
                select.appendChild(option);
            });
        } else {
            console.error('Erro ao carregar empresas:', await response.json());
        }
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
    }
}
