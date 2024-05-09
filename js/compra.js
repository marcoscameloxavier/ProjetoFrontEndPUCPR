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