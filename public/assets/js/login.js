// Certifique-se de que o Axios está incluído no seu projeto
// Você pode incluir via CDN no seu HTML:

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o envio do formulário padrão

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('/login', { username, password });

        if (response.status === 200) {
            localStorage.setItem('token', response.data.token); // Armazena o token no localStorage
            window.location.href = '/dashboard'; // Redireciona para o dashboard
        }
    } catch (error) {
        if (error.response) {
            // O servidor respondeu com um código de status fora do intervalo de 2xx
            alert(error.response.data.message); // Mostra mensagem de erro
        } else {
            console.error('Erro ao enviar o login:', error);
        }
    }
});

// Função para carregar empresas usando Axios
async function loadEmpresas() {
    try {
        const response = await axios.get('/empresas', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluindo o token
            }
        });

        if (response.status === 200) {
            const empresas = response.data;
            const select = document.getElementById('empresaSelect');
            empresas.forEach(empresa => {
                const option = document.createElement('option');
                option.value = empresa.id;
                option.textContent = empresa.nome;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar empresas:', error.response ? error.response.data : error);
    }
}

// Chame loadEmpresas quando necessário
