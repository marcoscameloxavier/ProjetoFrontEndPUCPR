function ajustarPrecoTotaleProdutos() {
    var carrinho = JSON.parse(localStorage.getItem("carrinhoLivros"));
    if (carrinho != null) {
        var total = 0;
        var totalprodutos = 0;
        for (var i = 0; i < carrinho.length; i++) {
            total += carrinho[i].quantidade * carrinho[i].preco;
            totalprodutos += carrinho[i].quantidade;
        }
        /*total = total.toFixed(2);*/
        // Formata o preço para o formato de moeda brasileiro
        var precoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(total);
        document.getElementById("label-itens-total-carrinho").innerHTML = `Subtotal (${totalprodutos} itens)`;
        document.getElementById("itens-total-carrinho").innerHTML = `${precoFormatado}`;
        document.getElementById("valor-total-carrinho").innerHTML = `${precoFormatado}`;
    }
}