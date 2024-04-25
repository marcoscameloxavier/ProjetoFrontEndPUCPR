// Desabilita a rolagem com a roda do mouse para evitar a mudança de valor
document.getElementById('numero').addEventListener('wheel', function(e) {
    e.preventDefault();
});

