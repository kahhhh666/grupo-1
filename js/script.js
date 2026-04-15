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
