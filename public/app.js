// Login
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    
    if (response.status === 200) {
      alert('Login bem-sucedido!');
      // Redirecionar para a tela de seleção de empresa ou dashboard
      window.location.href = '/dashboard.html';
    } else {
      alert(data.message);
    }
});

// Cadastro de Usuário
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    
    if (response.status === 200) {
      alert('Cadastro bem-sucedido! Faça login para continuar.');
      window.location.href = '/login.html';
    } else {
      alert(data.message);
    }
});

// Cadastro de Empresa
document.getElementById('registerCompanyForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const cnpj = document.getElementById('cnpj').value;
    const nome = document.getElementById('nome').value;
  
    const response = await fetch('/register-company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cnpj, nome }),
    });
  
    const data = await response.json();
    
    if (response.status === 200) {
      alert('Empresa cadastrada com sucesso!');
      window.location.href = '/dashboard.html'; // Ou onde você quiser redirecionar
    } else {
      alert(data.message);
    }
});
