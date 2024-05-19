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
    var cepZerado = validarCepIncompleto();
    if (cepZerado === true) {
        consultarCEP();
    }
});

document.getElementById('cep').addEventListener('focus', function() {
    var cepZerado = validarCepIncompleto();
    if (cepZerado === false) {
    limparEndereco();
    }
});

function limparEndereco() {
        document.getElementById('logradouro').value = '';
        document.getElementById('numero').value = '';
        document.getElementById('complemento').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('uf').value = '';
}

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
                    //preenche as caixas de logradouro, bairro, cidade e UF voltam a cor original, bloqueia o alerta campo obrigatorio
                    document.getElementById('cep').style.borderColor = '#85a99d';
                    document.getElementById('erro_cep').style.display = 'none';

                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('logradouro').style.borderColor = '#85a99d';
                    document.getElementById('erro_logradouro').style.display = 'none';

                    document.getElementById('complemento').value = data.complemento;

                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('cidade').style.borderColor = '#85a99d';
                    document.getElementById('erro_cidade').style.display = 'none';


                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('bairro').style.borderColor = '#85a99d';
                    document.getElementById('erro_bairro').style.display = 'none';


                    document.getElementById('uf').value = data.uf;
                    document.getElementById('uf').style.borderColor = '#85a99d';
                    document.getElementById('erro_uf').style.display = 'none';


                    }
                })
                .catch(error => console.error('Erro ao buscar CEP:', error));
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            displayErrorModal('Erro ao buscar o CEP. Por favor, tente novamente.');
        }
    }

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

document.querySelector('.formulario-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        email: document.getElementById('email').value,
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        uf: document.getElementById('uf').value,
        telefone_celular: document.getElementById('telefone_celular').value,
        cpf: document.getElementById('cpf').value,
        senha: document.getElementById('senha').value,
        confirmar_senha: document.getElementById('confirmar_senha').value,
    };


    localStorage.setItem('cadastro', JSON.stringify(formData));
    alert('Dados salvos com sucesso!');
});


function validarNome() {
    var passouNasValidacoes = true;
    var inputNomeTitular = document.getElementById("nome");
    var campoErro = document.getElementById("erro_nome");
    if (inputNomeTitular.value === '') {
        inputNomeTitular.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputNomeTitular.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarSobrenome() {
    var passouNasValidacoes = true;
    var inputSobrenomeTitular = document.getElementById("sobrenome");
    var campoErro = document.getElementById("erro_sobrenome");
    if (inputSobrenomeTitular.value === '') {
        inputSobrenomeTitular.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputSobrenomeTitular.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarEmail() {
    var passouNasValidacoes = true;
    var inputEmailTitular = document.getElementById("email");
    var campoErro = document.getElementById("erro_email");
    if (inputEmailTitular.value === '') {
        inputEmailTitular.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputEmailTitular.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarCepIncompleto() {
    var passouNasValidacoes = true;
    var inputCepTitular = document.getElementById("cep");
    var campoErro = document.getElementById("erro_cep");
    // tentar inserir o teste do cep incompleto
    if (inputCepTitular.value === '') {
        inputCepTitular.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputCepTitular.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarCepIncompleto() {
    var passouNasValidacoes = true;
    var inputCepTitular = document.getElementById("cep");
    var campoErro = document.getElementById("erro_cep");
    if (inputCepTitular.value === '' || inputCepTitular.value.length < 9) {
        inputCepTitular.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputCepTitular.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

//parei aqui
function validarLogradouro() {
    var passouNasValidacoes = true;
    var inputLogradouro = document.getElementById("logradouro");
    var campoErro = document.getElementById("erro_logradouro");
    if (inputLogradouro.value.length === 0 ) {
        inputLogradouro.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputLogradouro.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarNumLogradouro() {
    var passouNasValidacoes = true;
    var inputNumero = document.getElementById("numero");
    var campoErro = document.getElementById("erro_numero");
    if (inputNumero.value.length === 0 ) {
        inputNumero.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputNumero.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarBairro() {
    var passouNasValidacoes = true;
    var inputBairro = document.getElementById("bairro");
    var campoErro = document.getElementById("erro_bairro");
    if (inputBairro.value.length === 0 ) {
        inputBairro.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputBairro.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarCidade() {
    var passouNasValidacoes = true;
    var inputCidade = document.getElementById("cidade");
    var campoErro = document.getElementById("erro_cidade");
    if (inputCidade.value.length === 0 ) {
        inputCidade.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputCidade.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarUF() {
    var passouNasValidacoes = true;
    var inputUF = document.getElementById("uf");
    var campoErro = document.getElementById("erro_uf");
    if (inputUF.value.length === 0 ) {
        inputUF.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputUF.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarTelefoneCelular() {
    var passouNasValidacoes = true;
    var inputTelefoneCelular = document.getElementById("telefone_celular");
    var campoErro = document.getElementById("erro_telefone_celular");
    if (inputTelefoneCelular.value.length === 0 ) {
        inputTelefoneCelular.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputTelefoneCelular.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarCPF() {
    var passouNasValidacoes = true;
    var inputCPF = document.getElementById("cpf");
    var campoErro = document.getElementById("erro_cpf");
    if (inputCPF.value.length === 0 ) {
        inputCPF.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputCPF.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarSenhaPreenchida() {
    var passouNasValidacoes = true;
    var inputSenha = document.getElementById("senha");
    var campoErro = document.getElementById("erro_senha");
    if (inputSenha.value.length === 0 ) {
        inputSenha.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputSenha.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarConfirmacaoSenhaPreenchida() {
    var passouNasValidacoes = true;
    var inputSenhaConfirmacao = document.getElementById("confirmar_senha");
    var campoErro = document.getElementById("erro_conf_senha");
    if (inputSenhaConfirmacao.value.length === 0 ) {
        inputSenhaConfirmacao.style.borderColor = 'red';
        campoErro.style.display = 'block';
        passouNasValidacoes = false;
    }
    else{
        inputSenhaConfirmacao.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}


