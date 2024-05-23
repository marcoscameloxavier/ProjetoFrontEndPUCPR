window.onload = async function() {
    carregarCarrinhoCompra();
}

function carregarCarrinhoCompra(){
    var carrinho = JSON.parse(localStorage.getItem("carrinhoLivros"));
     if (carrinho != null){
        document.getElementById("itens-carrinho").innerHTML = "";
        for (var i = 0; i < carrinho.length; i++) {
            var itemCarrinho = `
                <div class="item-carrinho">
                   <img class="capa-livro" src="${carrinho[i].src}">
                   <div class="info-livro-resumida">
                       <span class="titulo-livro">${carrinho[i].titulo}</span>
                       <span class="preco-livro">Preço unitário: R$ ${carrinho[i].preco}</span>
                       <span class="preco-livro">Total de itens: ${carrinho[i].quantidade}</span>
                       <span class="preco-livro">Preço total dos itens: R$ ${calcularPrecoTotalItemCarrinho(carrinho[i].quantidade,carrinho[i].preco)}</span>
                   </div>
               </div>
            `
            document.getElementById("itens-carrinho").innerHTML += itemCarrinho;
        }
    }
    ajustarPrecoTotaleProdutos(true);
}

function mostrarCarrinhoPaginaIncial(){
    localStorage.setItem('exibirCarrinho', 'true');
    window.location.href = "index.html";
}

function mostrarPagamentoCartao(){
    document.getElementById("div-pagamento-cartao").style.display = "block";
    document.getElementById("div-pagamento-boleto").style.display = "none";
    document.getElementById("div-pagamento-pix").style.display = "none";
}
function mostrarPagamentoBoleto(){
    document.getElementById("div-pagamento-cartao").style.display = "none";
    document.getElementById("div-pagamento-boleto").style.display = "block";
    document.getElementById("div-pagamento-pix").style.display = "none";
}

function mostrarPagamentoPix(){
    document.getElementById("div-pagamento-cartao").style.display = "none";
    document.getElementById("div-pagamento-boleto").style.display = "none";
    document.getElementById("div-pagamento-pix").style.display = "block";
}

document.getElementById('numero-cartao').addEventListener('input', function (e) {
    var input = e.target;
    var valorFormatado = mascaraCartao(input.value);
    input.value = valorFormatado;
});


function mascaraCartao(numeroCartao) {
    numeroCartao = numeroCartao.replace(/\D/g, ''); // Remove qualquer caracter que não seja dígito
    numeroCartao = numeroCartao.replace(/(\d{4})(\d)/, '$1 4'); // Coloca um espaco depois do quarto dígito
    numeroCartao = numeroCartao.replace(/(\d{4})(\d)/, '$1 4'); // Coloca um espaco depois do quarto dígito
    numeroCartao = numeroCartao.replace(/(\d{4})(\d)/, '$1 4'); // Coloca um espaco depois do quarto dígito
    numeroCartao = numeroCartao.replace(/(\d{4})(\d)/, '$1 4'); // Coloca um espaco depois do quarto dígito
    return numeroCartao;
}

document.getElementById('cvv-cartao').addEventListener('input', function (e) {
    var input = e.target;
    var valorFormatado = mascaraCVV(input.value);
    input.value = valorFormatado;
});

function mascaraCVV(numeroCVV) {
    numeroCVV = numeroCVV.replace(/\D/g, ''); // Remove qualquer caracter que não seja dígito
    return numeroCVV;
}

document.getElementById('validade-cartao').addEventListener('input', function (e) {
    var input = e.target;
    var valorFormatado = mascaraValidade(input.value);
    input.value = valorFormatado;
});

function mascaraValidade(validade) {
    validade = validade.replace(/\D/g, ''); // Remove qualquer caracter que não seja dígito
    validade = validade.replace(/(\d{2})(\d)/, '$1/2'); // Coloca uma barra depois do  dígito
    return validade;

}

function finalizarPagamento(){
    var passouNasValidacoes = true;
    console.log("Validacoes");
    if(document.getElementById("div-pagamento-cartao").style.display === "block"){
        passouNasValidacoes = validarPagamentoCartao();
        console.log(passouNasValidacoes);
    }
    if (passouNasValidacoes) {
        localStorage.removeItem("carrinhoLivros");
        document.getElementById("div-compra-finalizada").style.display = "block";
        document.getElementsByClassName("container-resumo")[0].style.display = "none";
        document.getElementsByClassName("container-pagamento")[0].style.display = "none";
    }
}

function validarPagamentoCartao(){
    var validouCVV = validarCVV();
    var validouNum = validarNumeroCartao();
    var validouVal = validarValidade();
    var validouNom = validarNomeTitular();
    return validouCVV && validouNum && validouVal && validouNom;
}

function validarNumeroCartao() {
    var passouNasValidacoes = true;
    var inputNumCartao = document.getElementById("numero-cartao")
    var campoErro = document.getElementById("erro_num-cartao");
    if (inputNumCartao.value === '') {
        inputNumCartao.style.borderColor = 'red';
        campoErro.style.display = 'block';
        campoErro.innerHTML = 'Campo obrigatório';
        passouNasValidacoes = false;
    }
    else if (inputNumCartao.value.length < 19){
        inputNumCartao.style.borderColor = 'red';
        campoErro.style.display = 'block';
        campoErro.innerHTML = 'Número do cartão inválido';
        passouNasValidacoes = false;
    }
    else{
        inputNumCartao.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarCVV() {
    var passouNasValidacoes = true;
    var inputCVV = document.getElementById("cvv-cartao")
    var campoErro = document.getElementById("erro_cvv-cartao");
    if (inputCVV.value === '') {
        inputCVV.style.borderColor = 'red';
        campoErro.style.display = 'block';
        campoErro.innerHTML = 'Campo obrigatório';
        passouNasValidacoes = false;
    }
    else if (inputCVV.value.length < 3){
        inputCVV.style.borderColor = 'red';
        campoErro.style.display = 'block';
        campoErro.innerHTML = 'Número do CVV inválido';
        passouNasValidacoes = false;
    }
    else{
        inputCVV.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarValidade() {
    var passouNasValidacoes = true;
    var inputValidade = document.getElementById("validade-cartao")
    var campoErro = document.getElementById("erro_validade-cartao");
    if (inputValidade.value === '') {
        inputValidade.style.borderColor = 'red';
        campoErro.style.display = 'block';
        campoErro.innerHTML = 'Campo obrigatório';
        passouNasValidacoes = false;
    }
    else if (inputValidade.value.length < 5){
        inputValidade.style.borderColor = 'red';
        campoErro.style.display = 'block';
        campoErro.innerHTML = 'Data Inválida';
        passouNasValidacoes = false;
    }
    else if (inputValidade.value.length === 5){
        var mes = parseInt(inputValidade.value.substring(0,2));
        var ano = parseInt(inputValidade.value.substring(3,5));
        if (mes < 1 || mes > 12 || ano < 24 || ano > 50){
            inputValidade.style.borderColor = 'red';
            campoErro.style.display = 'block';
            campoErro.innerHTML = 'Data Inválida';
            passouNasValidacoes = false;
        }
        else{
            inputValidade.style.borderColor = '#85a99d';
            campoErro.style.display = 'none';
        }
    }
    else{
        inputValidade.style.borderColor = '#85a99d';
        campoErro.style.display = 'none';
    }
    return passouNasValidacoes;
}

function validarNomeTitular() {
    var passouNasValidacoes = true;
    var inputNomeTitular = document.getElementById("nome-cartao")
    var campoErro = document.getElementById("erro_titular-cartao");
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

function atualizarParcelamento(valorTotal) {
    var container = document.getElementById('opcoes-parcelamento');
    container.innerHTML = ''; // Limpa opções anteriores
    var numeroParcelas = valorTotal > 500 ? 5 : (valorTotal > 400 ? 4 : (valorTotal > 300 ? 3 : 2 ));
    for (let i = 1; i <= numeroParcelas; i++) {
        let valorParcela = valorTotal / i;
        let label = `${i}x R$ ${valorParcela.toFixed(2)} sem juros - total R$ ${valorTotal.toFixed(2)}`;
        let option = document.createElement('option');
        option.value = i;
        option.text = label;
        container.appendChild(option);
    }
}

function mascarNomeTitularCartao(nomeTitular){
    //// Remove qualquer caracter que não seja dígito
    nomeTitular = nomeTitular.replace(/[^a-zA-Z ]/g, '');
    return nomeTitular;
}

document.getElementById('nome-cartao').addEventListener('input', function (e) {
    var input = e.target;
    var valorFormatado = mascarNomeTitularCartao(input.value);
    input.value = valorFormatado;
});
