import { salvarDados, buscarVeiculos, excluirVeiculoApi, alterarVeiculoApi } from "./scriptApi.js";

const formVec = document.querySelector("#formVeiculo");
const btnEnviar = document.querySelector("#btnEnviar");
const listaVeiculos = document.querySelector("#listaVeiculos");

// Taxas dos combustíveis para o cálculo do IPVA
const taxasCombustivel = {
    gasolina: 0.20,
    etanol: 0.15,
    bicombustivel: 0.10,
    hibrido: 0.08,
    eletrico: 0.02
};

// Função para renderizar a lista na tela 
const renderizarLista = async () => {
    listaVeiculos.innerHTML = "Carregando..."; // Feedback visual
    const veiculos = await buscarVeiculos();
    listaVeiculos.innerHTML = "";

    if (!veiculos || veiculos.length === 0) {
        listaVeiculos.innerHTML = "<p>Nenhum veículo cadastrado.</p>";
        return;
    }

    veiculos.forEach(v => {
        const item = document.createElement("div");
        item.classList.add("item");

        // --- LÓGICA DE CÁLCULO DE TAXAS ---

        // 1. Cálculo da idade do carro
        const anoAtual = new Date().getFullYear();
        const idade_carro = anoAtual - v.anoFabricacao;

        // 2. Cálculo do Seguro (10% do valor de mercado)
        const valorVeiculo = parseFloat(v.valorMercado) || 0;
        const seguro = valorVeiculo * 0.1;

        // 3. Cálculo do IPVA
        let ipva = 0;
        let ipvaTexto = "";

        if (idade_carro >= 20) {
            ipvaTexto = "Isento";
            item.classList.add("isento");
        } else {
            // Limpa os acentos do banco para bater com as chaves do objeto 'taxasCombustivel'
            const tipoNormalizado = v.tipoCombustivel 
                ? v.tipoCombustivel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
                : "";
                
            const taxa = taxasCombustivel[tipoNormalizado] || 0;
            ipva = valorVeiculo * taxa;
            ipvaTexto = ipva.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }

        // 4. Cálculo do Total
        const total = seguro + ipva;

        // --- FIM DA LÓGICA DE CÁLCULO ---

        item.innerHTML = `
            <p><strong>Placa:</strong> ${v.placa}</p>
            <p><strong>Modelo:</strong> ${v.modelo} (${v.marca})</p>
            <p><strong>Combustível:</strong> ${v.tipoCombustivel}</p>
            <p><strong>Idade do Veículo:</strong> ${idade_carro} anos</p>
            <hr>
            <p><strong>Seguro:</strong> ${seguro.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p><strong>IPVA:</strong> ${ipvaTexto}</p>
            <p><strong>Total (Seguro + IPVA):</strong> ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <button class="remover" data-id="${v.id}">Excluir</button>
            <button class="alterar" data-id="${v.id}">Alterar</button>
        `;

        // Evento de Excluir
        item.querySelector(".remover").addEventListener("click", async () => {
            if (confirm("Deseja excluir este veículo?")) {
                await excluirVeiculoApi(v.id);
                renderizarLista();
            }
        });

        // Evento de Alterar
        item.querySelector(".alterar").addEventListener("click", () => {
            carregaForm(v);
        });

        listaVeiculos.appendChild(item);
    });
};

// CHAMADA INICIAL: Carrega a lista assim que o script inicia
renderizarLista();

// Cadastrar veículo
btnEnviar.addEventListener("click", async (evt) => {
    evt.preventDefault();

    // Captura os dados do formulário no momento do clique
    const dadosForm = new FormData(formVec);
    const dataInput = dadosForm.get('ano');

    if (!dataInput) {
        alert("Por favor, preencha a data de fabricação.");
        return;
    }

    const anoVeiculo = new Date(dataInput);

    const objVeiculos = {
        marca: dadosForm.get('marca'),
        modelo: dadosForm.get('modelo'),
        placa: dadosForm.get('placa'),
        anoFabricacao: anoVeiculo.getFullYear(),
        valorMercado: parseFloat(dadosForm.get('valor')),
        tipoCombustivel: dadosForm.get('combustivel')
    };

    // Validação básica antes de enviar
    if (!objVeiculos.tipoCombustivel) {
        alert("Selecione um tipo de combustível!");
        return;
    }

    await salvarDados(objVeiculos);
    formVec.reset();
    renderizarLista(); // Atualiza a lista após cadastrar
});

// Envia os dados para a API de alteração
const alterarVeiculo = async (objVeiculoAtt) => {
    const resultadoAlterar = await alterarVeiculoApi(objVeiculoAtt);
    return resultadoAlterar;
}

// Preenche o formulário com os dados do veículo selecionado
const carregaForm = (objVeiculoAtt) => {
    document.querySelector('#placa').value = objVeiculoAtt.placa || '';
    document.querySelector('#marca').value = objVeiculoAtt.marca || '';
    document.querySelector('#modelo').value = objVeiculoAtt.modelo || '';
    
    // Converte o ano de fabricação para o formato de input de data (YYYY-MM-DD)
    if (objVeiculoAtt.anoFabricacao) {
        document.querySelector('#ano').value = `${objVeiculoAtt.anoFabricacao}-01-01`;
    }
    
    // Verifica se o campo cor existe no DOM antes de preencher
    const inputCor = document.querySelector('#cor');
    if (inputCor) inputCor.value = objVeiculoAtt.cor || '';
    
    document.querySelector('#valor').value = objVeiculoAtt.valorMercado || '';

   
    if (objVeiculoAtt.tipoCombustivel) {
        
        const tipoNormalizado = objVeiculoAtt.tipoCombustivel
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Busca o rádio pelo ID e marca
        const radio = document.querySelector(`#${tipoNormalizado}`);
        if (radio) {
            radio.checked = true;
        }
    }
}