// Desabilita a rolagem com a roda do mouse para evitar a mudança de valor
document.getElementById('numero').addEventListener('wheel', function(e) {
    e.preventDefault();
});

function mascaraCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove qualquer caracter que não seja dígito
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca um ponto depois do terceiro dígito
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca um ponto depois do sexto dígito
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca um hífen antes dos dois últimos dígitos
    return cpf;
}

document.getElementById('cpf').addEventListener('input', function (e) {
    var input = e.target;
    var valorFormatado = mascaraCPF(input.value);
    input.value = valorFormatado;
});

function mascaraTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ''); // Remove qualquer caracter que não seja dígito
    telefone = telefone.replace(/(\d{2})(\d)/, '($1)$2'); // Coloca um parêntese depois dos dois primeiros dígitos
    telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2'); // Coloca um hífen depois dos quatro primeiros dígitos
    return telefone;
}

document.getElementById('telefone_celular').addEventListener('input', function (e) {
    var input = e.target;
    var valorFormatado = mascaraTelefone(input.value);
    input.value = valorFormatado;
});


function mascaraCEP(cep) {
    cep = cep.replace(/\D/g, ''); // Remove qualquer caracter que não seja dígito
    cep = cep.replace(/^(\d{5})(\d)/, '$1-$2'); // Coloca um hífen após os cinco primeiros dígitos
    return cep;
}

document.getElementById('cep').addEventListener('input', function (e) {
    var input = e.target;
    var valorFormatado = mascaraCEP(input.value);
    input.value = valorFormatado;
});


// API de CEP

function displayErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').style.display = 'block';
}

document.getElementById('cep').addEventListener('blur', function() {
    consultarCEP();
});

function limparErroCep() {
    document.getElementById('errocep').style.display = 'none';
    document.getElementById('cep').style.borderColor = '#85a99d';

}

function consultarCEP() {
    const cep = removerMascaraCEP(document.getElementById('cep').value);
    if ( cep.length==8 )  {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        try {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar CEP');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.logradouro===undefined) {
                        //aqui é o tratamento de erro
                        document.getElementById('cep').value = '';
                        document.getElementById('cep').style.borderColor = 'red';
                        document.getElementById('errocep').style.display = 'block';
                    }
                    else{
                    document.getElementById('cep').style.borderColor = '#85a99d';
                    document.getElementById('errocep').style.display = 'none';
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('complemento').value = data.complemento;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('uf').value = data.uf;
                    }
                })
                .catch(error => console.error('Erro ao buscar CEP:', error));
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            displayErrorModal('Erro ao buscar o CEP. Por favor, tente novamente.');
        }
    }
    /* esse código eu vou retirar no próximo commit.
    const cep = removerMascaraCEP(document.getElementById('cep').value);
    console.log(cep);
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('logradouro').value = data.logradouro;
            document.getElementById('complemento').value = data.complemento;
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('uf').value = data.uf;
        })
        .catch(error => console.error('Erro ao buscar CEP:', error)); */
}

function removerMascaraCEP(cep) {
    // Remove todos os caracteres que não são dígitos
    cep = cep.replace(/\D/g, '');
    return cep;
}

/* senha */

document.getElementById('toggleSenha').addEventListener('click', function() {
    const senha = document.getElementById('senha');
    if (senha.type === 'password') {
        senha.type = 'text';
        this.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        senha.type = 'password';
        this.classList.replace('fa-eye', 'fa-eye-slash');
    }
});

document.getElementById('toggleConfirmarSenha').addEventListener('click', function() {
    const confSenha = document.getElementById('confirmar_senha');
    if (confSenha.type === 'password') {
        confSenha.type = 'text';
        this.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        confSenha.type = 'password';
        this.classList.replace('fa-eye', 'fa-eye-slash');
    }
});

document.getElementById('confirmar_senha').addEventListener('input', function() {
    const senha = document.getElementById('senha').value;
    const confSenha = this.value;
    if (senha !== confSenha) {
        this.setCustomValidity('As senhas não coincidem.');
    } else {
        this.setCustomValidity('');
    }
});



