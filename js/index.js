window.onload = async function() {
    carregarLivros('html');
    carregarUsuarioLogado();
    if(localStorage.getItem('exibirCarrinho') === 'true') {
        mostrarCarrinho();
        localStorage.removeItem('exibirCarrinho');
    }
}



function carregarUsuarioLogado () {
    if(localStorage.getItem('usuarioLogado') === 'true') {
        var cadastro = JSON.parse(localStorage.getItem('cadastro'));
        document.getElementById("id-usuario-logado").innerHTML = "Olá,  "+cadastro.nome;
        document.getElementById("texto-login").innerHTML = "Sair";
    }
    else
    {
        document.getElementById("texto-login").innerHTML = "Login";
        document.getElementById("id-usuario-logado").innerHTML = "Olá, faça seu login";
    }

}

async function pesquisarLivros() {
    var livros = document.getElementById("termo-pesquisa").value;
    carregarLivros(livros)
}
async function carregarLivros(query) {
    const apiKey = 'AIzaSyAzPMMGofkOJx-0Fb8uoutZV7apJKYCHqg';

    document.getElementById("livros").innerHTML = "";
    document.getElementById("loading").style.display = "block"; // Mostrar a mensagem de carregamento


    if (query === "") {
        query = "html";
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
            // evitar erro quando existe aspas simples no nome do livro para não quebrar a string quando chamar a função salvarItemCarrinho
            var tituloEscapado = titulo.replace(/'/g, "\\'");

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
                   <button class="botao" onclick="salvarItemCarrinho('${book.id}','${tituloEscapado}',${preco},'${src}')">Adicionar ao carrinho</button>
               </div>
           </div>
        `
            document.getElementById("livros").innerHTML += livro;
        }
    }
    document.getElementById("loading").style.display = "none"; // Esconder a mensagem de carregamento
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
    ajustarPrecoTotaleProdutos(false);
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
    textoTotal = document.getElementById("itens-total-carrinho");
    textoValorTotal = document.getElementById("valor-total-carrinho");
    labelTotal = document.getElementById("label-itens-total-carrinho");
    labelValorTotal = document.getElementById("label-valor-total-carrinho");
    textofrete = document.getElementById("frete-carrinho");
    labelFrete = document.getElementById("label-frete-carrinho");

    if (carrinho === null){
        document.getElementById("itens-carrinho").innerHTML = "</br>Você ainda não adicionou nenhum item ao carrinho!";
        botaoFinalizarCompra.style.display = "none";
        botaoLimparCarrinho.style.display = "none";
        textoTotal.style.display = "none";
        textoValorTotal.style.display = "none";
        labelTotal.style.display = "none";
        labelValorTotal.style.display = "none";
        textofrete.style.display = "none";
        labelFrete.style.display = "none";
    }
    else{
        document.getElementById("itens-carrinho").innerHTML = "";
        botaoFinalizarCompra.style.display = "block";
        botaoLimparCarrinho.style.display = "block";
        textoTotal.style.display = "block";
        textoValorTotal.style.display = "block";
        labelTotal.style.display = "block";
        labelValorTotal.style.display = "block";
        textofrete.style.display = "block";
        labelFrete.style.display = "block";

        for (var i = 0; i < carrinho.length; i++) {
            var itemCarrinho = `
                <div class="item-carrinho">
                   <img class="capa-livro" src="${carrinho[i].src}">
                   <div class="info-livro">
                       <span class="titulo-livro">${carrinho[i].titulo}</span>
                       <span class="preco-livro">R$ ${calcularPrecoTotalItemCarrinho(carrinho[i].quantidade,carrinho[i].preco)}</span>
                       <div class="quantidade-livro">
                           <button class="btn-quantidade diminuir" onclick="diminuirQuantidade('${carrinho[i].id}')">-</button>
                           <input type="text" class="input-quantidade-carrinho" value="${carrinho[i].quantidade}" readonly>
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
    fecharModalLimparCarrinho();
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
            if(carrinho[i].quantidade <= 1) {
                carrinho.splice(i, 1);
                localStorage.setItem("carrinhoLivros", JSON.stringify(carrinho));
                if(carrinho.length === 0){
                    limparCarrinho();
                }
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



// Função para abrir o modal de confirmação de limpeza do carrinho
function mostrarModalLimparCarrinho() {
    document.getElementById('modalConfirmacao').style.display = 'block';
}

// Função para fechar o modal de confirmação de limpeza do carrinho
function fecharModalLimparCarrinho() {
    document.getElementById('modalConfirmacao').style.display = 'none';
}

//Bloco para o Modal de Login
function mostrarModalLogin() {
    fecharModalFazerLogin();
    if(localStorage.getItem('usuarioLogado') === 'true') {
        logout();
    }
    else{
    document.getElementById('modalLogin').style.display = 'block';
    }
}

//Funcao para fechar o modal de login
function fecharModalLogin() {
        document.getElementById('modalLogin').style.display = 'none';


}

// Função para efetuar o login
function login() {
    if (validarCamposSubmissao() === true) {
        var email = document.getElementById("email").value;
        console.log(email);
        var senha = document.getElementById("senha").value;
        console.log(senha);
        var cadastro = JSON.parse(localStorage.getItem('cadastro'));
        if (cadastro.email === email && cadastro.senha === senha) {
            document.getElementById('erro_login' ).style.display = 'none';
            localStorage.setItem("usuarioLogado", "true");
            carregarUsuarioLogado();
            fecharModalLogin();
        } else {
            document.getElementById('erro_login' ).style.display = 'block';
        }
    }
}

function logout() {
    localStorage.setItem("usuarioLogado","false");
    carregarUsuarioLogado();
}


// Função para efetuar o cadastro
function cadastro() {
    // Aqui você pode adicionar o código para direcionar o usuário para a página de cadastro
    // Por enquanto, apenas exibiremos uma mensagem no console

}

// Adiciona um ouvinte de eventos ao botão de fechar
var botaoFecharLogin = document.getElementById('fechar-login');
botaoFecharLogin.addEventListener('click', fecharModalLogin);

//Evento do menu sanduiche (toogle)
function toogleMenu() {
    var menu = document.getElementById('menu-principal');
    var isMenuVisible = menu.style.display === 'flex';
    menu.style.display = isMenuVisible ? 'none' : 'flex';
}

// Event listener para redimensionamento da janela
window.addEventListener('resize', function() {
    var menu = document.getElementById('menu-principal');
    if (window.innerWidth > 600) {
        menu.style.display = ''; // Remove o estilo inline quando a tela é grande
    } else {
        if (menu.style.display === '') {
            menu.style.display = 'none'; // Garante que o menu fique escondido se a tela for redimensionada para menos de 900px
        }
    }
});

function finalizarCompra() {
    if(localStorage.getItem('usuarioLogado') === 'true') {
        window.location.href = "compra.html";
    }
    else{
        mostrarModalFazerLogin();
    }
}

function mostrarModalFazerLogin() {
    document.getElementById('modalFazerLogin').style.display = 'block';
}

function fecharModalFazerLogin() {
    document.getElementById('modalFazerLogin').style.display = 'none';
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

function validarCamposSubmissao(){
    var validouEmail = validarEmail();
    var validouSenha = validarSenhaPreenchida();
    return (validouEmail && validouSenha);
}