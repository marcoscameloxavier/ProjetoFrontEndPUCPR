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
                  <!-- <img class="capa-livro" src="${carrinho[i].src}">-->
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
    ajustarPrecoTotaleProdutos()
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
