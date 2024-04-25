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


