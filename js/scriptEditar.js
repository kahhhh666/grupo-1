import { buscaVeiculoPorId, atualizarVeiculoApi } from "./scriptApi";

const formEditar = document.querySelector("#formVeiculo");
const btnAtualizar = document.querySelector("#btnAtualizar");

//1. pegar ID da URL
const urlParams = new URLSearchParams(window.location.search);
const veiculoId = urlParams.get('id');

//2. Carregar os dados do veículo ao abrir a página

const carregarDadosParaEdicao = async () => {
    if(!veiculoId){
        alert("ID do veículo não encontrado!");
        window.location.href = 'index.html';
        return;
    }

    const veiculo = await buscarVeiculoPorId(veiculoId);

    if(veiculo){
        //Preencher os campos do formulário
        document.getElementById("modelo").value = veiculo.modelo;
        document.getElementById("marca").value = veiculo.marca;
        document.getElementById("placa").value = veiculo.placa;
        document.getElementById("valor").value = veiculo.valorMercado;

        if(veiculo.anoFabricacao){
            document.getElementById("ano").value = `${veiculo.anoFabricacao}-01-01`;
        }

        //selecione o rádio do combustivel

        if(veiculo.tipoCombustivel){
            const radio = document.querySelector(`input[name="combustivel"][value="${veiculo.tipoCombustivel.toLowerCase()}"]`);
            if(radio) radio.checked = true;
        }
    } else {
        alert("Erro ao carregar dados do veículo.");
        window.location.href = 'index.html';
    }
};

//3. Salvar as alterações 

formEditar.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const dadosForm = new FormData(formEditar);
    const dataInput = dadosForm.get('ano');
    const anoFabricacao = new Date(dataInput).getFullYear();

    const objAtualizado = {
        marca: dadosForm.get('marca'),
        modelo: dadosForm.get('modelo'),
        placa: dadosForm.get('placa'),
        anoFabricacao: anoFabricacao,
        valorMercado: parseFloat(dadosForm.get('valor')),
        tipoCombustivel: dadosForm.get('combustivel')
    };

    const sucesso = await atualizarVeiculoApi(veiculoId, objAtualizado);

    if(sucesso){
        alert("Veículo atualizado com sucesso!");
        window.location.href = 'index.html'
    } else {
        alert("Erro ao atualiza veículo.");
    }
});

carregarDadosParaEdicao();