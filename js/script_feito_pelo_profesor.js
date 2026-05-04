const carregaForm = (objVeiculos) =>{
    document.querySelector('#placa').value = objVeiculos.placa
    document.querySelector('#marca').value = objVeiculos.marca
    document.querySelector('#modelo').value = objVeiculos.modelo
    document.querySelector('#ano').value = objVeiculos.placa
    document.querySelector('#cor').value = objVeiculos.cor
    document.querySelector('#valor').value = objVeiculos.valor
    objVeiculos.combustivel === 'gasolina' ? document.querySelector('#gasolina').checked = true : objVeiculos.combustivel === 'etanol' ? document.querySelector('#etanol').checked = true : objVeiculos.combustivel === 'bicombustivel' ? document.querySelector('#bicombustivel').checked = true : objVeiculos.combustivel === 'hibrido' ? document.querySelector('#hibrido').checked = true :  document.querySelector('#eletrico').checked = true }