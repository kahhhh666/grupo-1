const endPoint = 'https://localhost:7060/api/Veiculo';


const salvarDados = async (objVeiculos) => {

    console.log(objVeiculos)


    try {
        const resposta = await fetch(
            endPoint, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objVeiculos)
        });

        if (!resposta.ok) {
            const txtErro = await resposta.text();
            throw new Error(txtErro);
        }

        const dados = await resposta.json();
        return dados;

    } catch (error) {
        console.error("ERRO AO CADASTRAR: ", error);
    }
}

const buscarVeiculos = async () => {
    try {
        const resposta = await fetch(endPoint, {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
            //teve que remover o body pois não faz parte do comando body
        });

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        return await resposta.json();

    } catch (error) {
        console.error("ERRO AO BUSCAR VEÍCULOS: ", error);
        return [];
    }
}

//função buscar veiculo por id
const buscarVeiculoPorId = async (id) => {
    try {
        const resposta = await fetch(`${endPoint}/${id}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });
        if (!resposta.ok) throw new Error(`Erro ao buscar veículo: ${resposta.status}`);
        return await resposta.json();
    } catch (error) {
        console.error("ERRO AO BUSCAR VEÍCULO POR ID: ", error);
        return null;
    }
}

//Função atualizar 
const alterarVeiculoApi = async (objVeiculoAtt) => {
    const endPoint = `https://localhost:7060/api/Veiculo/${objVeiculoAtt.id}`;

    try {
        const resposta = await fetch(
            endPoint, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objVeiculoAtt)
        }
        )
        if (!resposta.ok) {
            const txtErro = await resposta.text();
            throw new Error(txtErro);
        }

        const dados = await resposta.json()
        return dados

    } catch (error) {
        console.log("ERRO AO CADASTRAR ", erro)
    }

}

const excluirVeiculoApi = async (id) => {
    try {
        const resposta = await fetch(`${endPoint}/${id}`, {
            method: 'DELETE',
            //teve que remover o headers e body (não necessários para delete por ID na URL)
        });
    } catch (error) {
        console.error("ERRO AO EXCLUIR: ", error);
        return false;
    }
}

export { salvarDados, buscarVeiculos, excluirVeiculoApi, alterarVeiculoApi };