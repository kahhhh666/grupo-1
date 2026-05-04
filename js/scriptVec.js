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
const cadastroveiculo = async (evt) => {
    evt.preventDefault(); // Agora evt está sendo recebido como parâmetro

    const dadosForm = new FormData(formVec); // Alterado de formVec para dadosForm para não sobrescrever o elemento DOM

    const idSalvo = sessionStorage.getItem('objVeiculoId');
    const id_veiculo = idSalvo === null ? 0 : parseInt(idSalvo); // Convertido para int por segurança

    // Evita o erro de anoVeiculo is not defined
    const anoInput = dadosForm.get('ano');
    const anoCalc = anoInput ? new Date(anoInput).getFullYear() : new Date().getFullYear();

    const objVeiculos = {
        marca: dadosForm.get('marca'),
        modelo: dadosForm.get('modelo'),
        placa: dadosForm.get('placa'),
        cor: dadosForm.get('cor'),
        anoFabricacao: anoCalc,
        valorMercado: parseFloat(dadosForm.get('valor')),
        tipoCombustivel: dadosForm.get('combustivel')
    };

    if (id_veiculo === 0) {
        // Estava chamando a si mesma criando um loop infinito. Agora chama salvarDados.
        await salvarDados(objVeiculos);
    } else {
        if (confirm(`Deseja alterar o veículo?`)) { // Ajustado texto (estava "Pessoa")
            objVeiculos.id = id_veiculo; // Precisamos passar o ID no objeto para a API saber quem editar
            await alterarVeiculo(objVeiculos);
        }
        // Limpa o sessionStorage para voltar ao modo de "Cadastro" caso o usuário submeta novamente
        sessionStorage.removeItem('objVeiculoId');
    }

    formVec.reset();
    renderizarLista(); // Atualiza a lista após cadastrar/alterar
};

// Ao invés de executar cadastroveiculo() direto no carregamento da tela, 
// nós adicionamos ela como um evento atrelado ao envio (submit) do formulário.
formVec.addEventListener("submit", cadastroveiculo);

// Envia os dados para a API de alteração
const alterarVeiculo = async (objVeiculoAtt) => {
    const resultadoAlterar = await alterarVeiculoApi(objVeiculoAtt);
    return resultadoAlterar;
}

// Preenche o formulário com os dados do veículo selecionado
const carregaForm = (objVeiculoAtt) => {
    // SALVA O ID: Fundamental para a função de cadastro saber que é uma edição
    sessionStorage.setItem('objVeiculoId', objVeiculoAtt.id);

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