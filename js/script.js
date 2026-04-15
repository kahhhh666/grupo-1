// GARANTE QUE O HTML CARREGOU
document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("#formVeiculo");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // validação do formulário
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        adicionarVeiculo();
    });

});

function adicionarVeiculo(){
    const form = document.querySelector("#formVeiculo");
    const lista = document.querySelector("#listaVeiculos");

    const item = document.createElement("div");
    item.classList.add("item");

    // pegando valores do html
    const modelo = document.getElementById("modelo").value;
    const marca = document.getElementById("marca").value;
    const placa = document.getElementById("placa").value;
}