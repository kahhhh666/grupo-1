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


//  FUNÇÃO PRINCIPAL
function adicionarVeiculo() {

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
        gasolina: 0.20,
        etanol: 0.15,
        bicombustivel: 0.10,
        hibrido: 0.08,
        eletrico: 0.02
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

    // criando item na tela
    item.innerHTML = `
        <hr>

        <p><strong>Placa:</strong> ${placa}</p>
        <p><strong>Modelo:</strong> ${modelo}</p>
        <p><strong>Marca:</strong> ${marca}</p>
        <p><strong>Idade do Veículo:</strong> ${idade_carro}</p>
        <p><strong>Cor:</strong> ${cor}</p>

        <p><strong>Seguro:</strong> ${seguro.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}</p>

        <p><strong>IPVA:</strong> ${ipvaTexto}</p>

        <p><strong>Total:</strong> ${total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}</p>

        <button class="remover">Excluir</button>
    `;

    // Criação do botão excluir
    const btnExcluir = item.querySelector(".remover");

    btnExcluir.addEventListener("click", function () {
        if (confirm("Tem certeza que deseja excluir esse veículo?")) {
            item.remove();
        }
    });

    // adiciona na lista
    lista.appendChild(item);

    // limpa formulário
    form.reset();
}