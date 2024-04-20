window.onload = async function() {
    carregarLivros('front-end');
}

async function pesquisarLivros() {
    var livros = document.getElementById("termo-pesquisa").value;
    carregarLivros(livros)
}
async function carregarLivros(query) {
    const apiKey = 'AIzaSyAzPMMGofkOJx-0Fb8uoutZV7apJKYCHqg';

    if (query === "") {
        query = "front-end";
    }

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&key=${apiKey}`;
    var retorno = await fetch(apiUrl);
    var dados = await retorno.json();

    document.getElementById("livros").innerHTML = "";

    if(dados.totalItems < 2){
        document.getElementById("livros").innerHTML = "</br></br> Não há resultados para sua busca!";
    }
    else {
        for (var i = 0; i < dados.items.length; i++) {
            var book = dados.items[i];
            var src = "";

            if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
                src = book.volumeInfo.imageLinks.thumbnail;
            } else {
                src = "../img/capaDefault.png"
            }

            var autores = "por ";
            if (book.volumeInfo.authors === undefined) {
                autores = "Autor não disponível.";
            } else {
                for (var j = 0; j < book.volumeInfo.authors.length; j++) {
                    autores += book.volumeInfo.authors[j] + ", ";
                }
                autores = autores.slice(0, autores.length - 2);
                autores += ".";
            }

            if (autores.length > 100) {
                autores = autores.slice(0, 100);
                autores += "...";
            }

            var titulo = book.volumeInfo.title;

            if (titulo.length > 65) {
                titulo = titulo.slice(0, 65);
                titulo += "...";
            }

            var preco = gerarPrecoAleatorio();


            var livro = `
          <div class="card">
               <div class="card-capa">
                   <img src=${src} />
               </div>
        
                   <div class="card-corpo">
                       <div class="card-corpo-titulo">
                           <div class="titulo-livro">${titulo} </div>
                           <div class="autores">${autores}</div>
                           <div class="preco-livro">R$ ${preco.replace('.', ',')}</div>
                       </div>
                   </div>
        
               <div class="card-rodape">
                   <button class="botao" onclick="salvarItemCarrinho('${book.id}','${titulo}',${preco},'${src}')">Adicionar ao carrinho</button>
               </div>
           </div>
        `
            document.getElementById("livros").innerHTML += livro;
        }
    }
}

// Adiciona um ouvinte de eventos ao campo de entrada
var input = document.getElementById("termo-pesquisa");
input.addEventListener("keypress", function(event) {
    // Verifica se a tecla ENTER foi pressionada
    if (event.key === "Enter") {
        event.preventDefault(); // Impede qualquer comportamento padrão do ENTER
        pesquisarLivros();
    }
});

function gerarPrecoAleatorio() {
    const min = 20;
    const max = 300;
    const precoAleatorio = Math.random() * (max - min) + min;
    // Formata o número para duas casas decimais usando vírgula para separar
    return precoAleatorio.toFixed(2);
}

function mostrarCarrinho(){
    var carrinhoLateral = document.getElementById('carrinho-lateral');
    carrinhoLateral.classList.add('mostrar');
    carregarCarrinho();
}

function esconderCarrinho() {
    var carrinhoLateral = document.getElementById('carrinho-lateral');
    carrinhoLateral.classList.remove('mostrar');
}

function salvarItemCarrinho(id, titulo, preco, srcImg){
    var carrinho = JSON.parse(localStorage.getItem("carrinhoLivros"));

    if(carrinho === null){
        carrinho = [];
    }

    var novoLivroCarrinho = {
        id: id,
        titulo: titulo,
        preco: preco,
        quantidade: 1,
        src: srcImg,
    };

    //verificar se já existe livro salvo no carrinho com o mesmo id
    for (var i = 0; i < carrinho.length; i++){
        if (carrinho[i].id === id){
            carrinho[i].quantidade++;
            localStorage.setItem("carrinhoLivros", JSON.stringify(carrinho));
            mostrarCarrinho();
            return;
        }
    }

    carrinho.push(novoLivroCarrinho);
    localStorage.setItem("carrinhoLivros", JSON.stringify(carrinho));
    mostrarCarrinho();
}

function carregarCarrinho(){
    var carrinho = JSON.parse(localStorage.getItem("carrinhoLivros"));
    botaoFinalizarCompra = document.getElementById("finalizar-compra");
    botaoLimparCarrinho = document.getElementById("limpar-carrinho");

    if (carrinho === null){
        document.getElementById("itens-carrinho").innerHTML = "</br>Você ainda não adicionou nenhum item ao carrinho!";
        botaoFinalizarCompra.style.display = "none";
        botaoLimparCarrinho.style.display = "none";
    }
    else{
        document.getElementById("itens-carrinho").innerHTML = "";
        botaoFinalizarCompra.style.display = "block";
        botaoLimparCarrinho.style.display = "block";

        for (var i = 0; i < carrinho.length; i++) {
            var itemCarrinho = `
                <div class="item-carrinho">
                   <img class="capa-livro" src="${carrinho[i].src}">
                   <div class="info-livro">
                       <span class="titulo-livro">${carrinho[i].titulo}</span>
                       <span class="preco-livro">R$ ${calcularPrecoTotalItemCarrinho(carrinho[i].quantidade,carrinho[i].preco)}</span>
                       <div class="quantidade-livro">
                           <button class="btn-quantidade diminuir" onclick="diminuirQuantidade('${carrinho[i].id}')">-</button>
                           <input type="text" value="${carrinho[i].quantidade}" readonly>
                           <button class="btn-quantidade aumentar" onclick="aumentarQuantidade('${carrinho[i].id}')">+</button>
                       </div>
                   </div>
               </div>
            `
            document.getElementById("itens-carrinho").innerHTML += itemCarrinho;
        }
    }
}

function limparCarrinho(){
    localStorage.removeItem("carrinhoLivros");
    carregarCarrinho();
}

function calcularPrecoTotalItemCarrinho(quantidade, preco){
    var total = quantidade * preco;
    // Arredonda para duas casas decimais antes de converter para string
    total = total.toFixed(2); // Isso retorna uma string já arredondada
    return total.replace('.', ',');
}

function aumentarQuantidade(id) {
    var carrinho = JSON.parse(localStorage.getItem('carrinhoLivros'));
    for (var i = 0; i < carrinho.length; i++){
        if (carrinho[i].id === id){
            carrinho[i].quantidade++;
            localStorage.setItem("carrinhoLivros", JSON.stringify(carrinho));
            mostrarCarrinho();
            return;
        }
    }
}

function diminuirQuantidade(id) {
    var carrinho = JSON.parse(localStorage.getItem('carrinhoLivros'));
    for (var i = 0; i < carrinho.length; i++){
        if (carrinho[i].id === id){
            if(carrinho[i].quantidade === 1) {
                carrinho.removeItem(i);
                carrinho[i].quantidade--;
                localStorage.setItem("carrinhoLivros", JSON.stringify(carrinho));
            }
            else {
                carrinho[i].quantidade--;
                localStorage.setItem("carrinhoLivros", JSON.stringify(carrinho));
            }
            mostrarCarrinho();
            return;
        }
    }
}