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
    /*const query = 'JavaScript';*/
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=30&key=${apiKey}`;
    var retorno = await fetch(apiUrl);
    var dados = await retorno.json();

    document.getElementById("livros").innerHTML = "";

    for(var i = 0; i < dados.items.length; i++) {
        var book = dados.items[i];
        var src = "";

        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
            src = book.volumeInfo.imageLinks.thumbnail;
        } else {
            src = "../img/capaDefault.png"
        }

        var autores = "por ";
        if(book.volumeInfo.authors == undefined){
            autores = "Autor não disponível.";
        }
        else{
            for(var j = 0; j < book.volumeInfo.authors.length; j++){
                autores += book.volumeInfo.authors[j] + ", ";
            }
            autores = autores.slice(0, autores.length-2);
            autores += ".";
        }


        var livro = `
          <div class="card">
               <div class="card-capa">
                   <img src=${src} />
               </div>
        
                   <div class="card-corpo">
                       <div class="card-corpo-titulo">
                           <div class="titulo-livro">${book.volumeInfo.title} </div>
                           <div class="autores">${autores}</div>
                           <div class="preco-livro">R$ 45,90</div>
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
