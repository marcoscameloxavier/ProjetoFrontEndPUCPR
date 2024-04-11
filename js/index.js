window.onload = async function() {
    carregarLivros();
    console.log("carregar");
}

async function carregarLivros() {
    const apiKey = 'AIzaSyAzPMMGofkOJx-0Fb8uoutZV7apJKYCHqg';
    const query = 'JavaScript';
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=30&key=${apiKey}`;
    console.log(apiUrl);
    var retorno = await fetch(apiUrl);
    var dados = await retorno.json();

    console.log(dados);

    for(var i = 0; i < dados.items.length; i++) {
        var book = dados.items[i];
        var src = "";

        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
            src = book.volumeInfo.imageLinks.thumbnail;
        } else {
            src = "../img/capaDefault.png"
        }

        var autores = "";
        console.log(book.volumeInfo.authors);
        if(book.volumeInfo.authors == undefined){
            autores = "autor não disponível";
        }
        else{
            for(var j = 0; j < book.volumeInfo.authors.length; j++){
                autores += book.volumeInfo.authors[j] + ", ";
            }
        }


        var livro = `
          <div class="card">
               <div class="card-capa">
                   <img src=${src} />
               </div>
        
                   <div class="card-corpo">
                       <div class="card-corpo-titulo">
                           Título: ${book.volumeInfo.title} <br>
                           Autores: ${autores}
                       </div>
                   </div>
        
               <div class="card-rodape">
                   <button>Adicionar ao carrinho</button>
               </div>
           </div>
        `

        document.getElementById("livros").innerHTML += livro;

    }

}
