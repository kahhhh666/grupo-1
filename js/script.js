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

    // data (type="date") coleta do dado
    const data = document.getElementById("ano").value;
    if (!data) return;

    const ano = new Date(data).getFullYear();

    const valor = parseFloat(document.getElementById("valor").value);
    const cor = document.getElementById("cor").value;

    const combustivel = document.querySelector('input[name="combustivel"]:checked')?.value;

    // segurança extra
    if (!combustivel) {
        alert("Selecione um combustível!");
        return;
    }

    // taxas dos combustiveis
    const taxas = {
        gasolina: 0.04,
        etanol: 0.03,
        bicombustivel: 0.035,
        hibrido: 0.02,
        eletrico: 0.01
    };

    // calculo do seguro
    const seguro = valor * 0.1;

    // calculo da idade do carro
    const anoAtual = new Date().getFullYear();
    const idade_carro = anoAtual - ano;

    let ipva = 0;
    let ipvaTexto = "";

    // cálculo do IPVA
    if (idade_carro >= 20) {
        ipvaTexto = "Isento";
        item.classList.add("isento");
    } else {
        const taxa = taxas[combustivel] || 0;
        ipva = valor * taxa;

        ipvaTexto = ipva.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    const total = seguro + ipva;

}