function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json() )
    .then(states => {
        for ( const state of states ){

        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value
    
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value> Selecione a cidade</option>"
    citySelect.disabled = true
    
    fetch(url)
    .then(res => res.json() )
    .then(cities => {

        for( const city of cities) {
            citySelect.innerHTML += `<option value="${city.id}">${city.nome}</option>`
        }
        citySelect.disabled = false
    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// Itens de coleta
const itemsToCollect = document.querySelectorAll(".items-grid li")
for (const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems =document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event){
    const itemLi =event.target

    /*Adicionar ou remover uma classe em JS
    itemLi.classList.remove
    itemLi.classList.toggle("selected")
    itemLi.classList.add
    */

    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    //Verificar se existem itens selecionados. Se sim, 
    //pegar os itens selecionados 
    const alreadySelected = selectedItems.findIndex ( item => {
        const itemFound = item == itemId
        return itemFound
    })

    //Se já estiver selecionado, tirar da seleção
   if( alreadySelected >=0 ) {
       const filteredItems = selectedItems.filter ( item =>{
           const itemIsDifferent = item != itemId
           return itemIsDifferent
       })
       selectedItems = filteredItems
    }else{
        //Se não estiver selecionado, adicionar à seleção
        selectedItems.push (itemId)

    }
     console.log(selectedItems)
    //Atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}
    
