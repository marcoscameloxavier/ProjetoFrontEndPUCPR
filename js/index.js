window.onload = async function() {
    carregarLivros('JavaScript');
}

async function pesquisarLivros() {
    console.log("pesquisar");
    var livros = document.getElementById("termo-pesquisa").value;
    console.log(livros);
    carregarLivros(livros)
}
async function carregarLivros(query) {
    const apiKey = 'AIzaSyAzPMMGofkOJx-0Fb8uoutZV7apJKYCHqg';
    console.log("Chamou carregar livros com " + query);

    if (query === "") {
        query = "JavaScript";
    }

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&key=${apiKey}`;
    var retorno = await fetch(apiUrl);
    var dados = await retorno.json();

    document.getElementById("livros").innerHTML = "";

    console.log(dados);

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

            var titulo = book.volumeInfo.title;

            if (titulo.length > 65) {
                titulo = titulo.slice(0, 65);
                titulo += "...";
            }


            var livro = `
          <div class="card">
               <div class="card-capa">
                   <img src=${src} />
               </div>
        
                   <div class="card-corpo">
                       <div class="card-corpo-titulo">
                           <div class="titulo-livro">${titulo} </div>
                           <div class="autores">${autores}</div>
                           <div class="preco-livro">R$ ${gerarPrecoAleatorio()}</div>
                       </div>
                   </div>
        
               <div class="card-rodape">
                   <button class="botao">Adicionar ao carrinho</button>
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
    return precoAleatorio.toFixed(2).replace('.', ',');
}
