//main locations
const inputConcepto = document.querySelector('#inputConcepto')
const inputCantidad = document.querySelector('#inputCantidad')
const buttonElement = document.querySelector('#buttonElement')
const historialElement = document.querySelector(".historial")
const resetButton = document.querySelector('#resetButton')

//itemsList stores the list of transactions 
let itemsList = []
//evento keeps track of how many times a transaction was added / button was clicked
let evento = 0


//when the page refreshes: old data is retrieved from LocalStorage and displayed
function displayData() {
    //retrieve from local storage
    ahorro_from_storage = localStorage.getItem("ahorro");
    ingreso_from_storage = localStorage.getItem("ingreso");
    gasto_from_storage = localStorage.getItem("gasto");

    //locations
    const IngresosElement = document.querySelector("#ingreso")
    const gastosElement = document.querySelector("#gasto")
    const ahorroElement = document.querySelector("#ahorro")

    //assign the old value to data
    if (ahorro_from_storage || ingreso_from_storage){
        ahorroElement.innerText = ahorro_from_storage 
        IngresosElement.innerText = ingreso_from_storage 
        gastosElement.innerText = gasto_from_storage 
        evento = parseInt(localStorage.getItem("evento"))
    } 

}

displayData()

//when the page refreshes: old list of transactions is retrieved from LocalStorage and displayed
function displayHistoricaltransactions() {
    items_from_storage = JSON.parse(localStorage.getItem("transactionsList"))

    if (items_from_storage) {
        for (let index = 0; index < items_from_storage.length; index++) {
        
            let getConcepto = items_from_storage[index].concepto
            let getCantidad = items_from_storage[index].cantidad
            let getValueID = items_from_storage[index].id
        
            addLineOfTransaction(getValueID, getCantidad, getConcepto)
        
            itemsList.push(items_from_storage[index])
        }
    }
}

function addLineOfTransaction(id, quantity, concept) {
    const newDivElement = document.createElement("div")
    newDivElement.setAttribute("class", `historicalBlock${id}`)
    newDivElement.setAttribute("id", "historicalBlock")
    const newHistoricalBlock = historialElement.appendChild(newDivElement)
    newHistoricalBlock.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/1024px-Red_X.svg.png" alt="x" onclick="deleteLineOfHistory(${id})" id="lineOfHistory${id}">
    <div>
        <p id = "conceptoEnElHistorial${id}"> ${concept} </p>
        <p id = "cantidadEnElHistorial${id}"> ${quantity}€ </p>
    </div>`

}


displayHistoricaltransactions()


//when the button "Anadir transaccion" is clicked: history of transactions updates as well as ingresos, gastos and ahorro
function addTransaction () {
    
    const inputCantidad = document.querySelector('#inputCantidad')
    if (inputCantidad.value != ''){

    addLineofTransactionFromInput ()
    updateIngresosYGastosYAhorro()
    clearInputs() }

}

buttonElement.addEventListener("click", addTransaction)

    
//add a line with the transaction details in the Historial section with input values
function addLineofTransactionFromInput () {
    const inputConcepto = document.querySelector('#inputConcepto')
    let inputCantidad = parseFloat(document.querySelector('#inputCantidad').value).toFixed(2)
    inputCantidad = parseFloat(inputCantidad).toFixed(2)

    //assign a standard value to empty fields in input  
    if (inputConcepto.value == '') {
        inputConcepto.value = 'transacción'
    } 

    //add transaction in the history
    addLineOfTransaction(evento, inputCantidad, inputConcepto.value)    

    //save in local storage
    saveInput(evento, inputCantidad, inputConcepto.value)

    evento++
    saveEvento()
} 


//clear the text in the input boxes 
function clearInputs() {
    inputConcepto.value = ""
    inputCantidad.value = ""
}

//update the data such as ingreso, gasto and ahorro from input values
function updateIngresosYGastosYAhorro() {
    const IngresosElement = document.querySelector("#ingreso")
    const gastosElement = document.querySelector("#gasto")
    const ahorroElement = document.querySelector("#ahorro")

    if (parseFloat(inputCantidad.value)>=0){
        let amount_ingreso = parseFloat(inputCantidad.value) + parseFloat(IngresosElement.innerText)
        amount_ingreso = amount_ingreso.toFixed(2)
        IngresosElement.innerText = amount_ingreso + '€'

    } else if (parseFloat(inputCantidad.value)<0){
        let amount_gasto = parseFloat(inputCantidad.value) + parseFloat(gastosElement.innerText)
        amount_gasto = amount_gasto.toFixed(2)
        gastosElement.innerText = amount_gasto + '€'
    }

    let amountAhorro = parseFloat(ahorroElement.innerText) + parseFloat(inputCantidad.value)
    amountAhorro = amountAhorro.toFixed(2)
    ahorroElement.innerText = amountAhorro + '€'

    saveData()
}

//delete a line of transaction when the button "x" next to transaction detail in Historial is clicked
function deleteLineOfHistory (evento) {
    updateDataAfterDelete(evento)

    const historicalBlock = document.getElementsByClassName(`historicalBlock${evento}`)
    historicalBlock[0].remove()

}

//when the button "x" next to transaction detail in Historial is clicked, we update the rest of the data such as gastos, ingresos and ahorro.
function updateDataAfterDelete(evento) {
    const newElement = document.querySelector(`#cantidadEnElHistorial${evento}`)
    const ahorroElement = document.querySelector("#ahorro")
    if (parseFloat(newElement.innerText) >= 0) {
        const IngresosElement = document.querySelector("#ingreso")
        let amount_ingreso =  parseFloat(IngresosElement.innerText) - parseFloat(newElement.innerText)
        amount_ingreso = amount_ingreso.toFixed(2)
        IngresosElement.innerText = amount_ingreso + '€'

    } else if (parseFloat(newElement.innerText) < 0) {
        const gastosElement = document.querySelector("#gasto")
        let amount_gasto = parseFloat(gastosElement.innerText) - parseFloat(newElement.innerText)
        amount_gasto = amount_gasto.toFixed(2)
        gastosElement.innerText = amount_gasto + '€'
    }

    ahorro_amount = parseFloat(ahorroElement.innerText) - parseFloat(newElement.innerText)
    ahorro_amount = ahorro_amount.toFixed(2)
    ahorroElement.innerText = ahorro_amount + '€'


    saveData()

    //updateobject
    items_from_storage = JSON.parse(localStorage.getItem("transactionsList"))
    const getIndex = itemsList.map(object => object.id).indexOf(evento);
    itemsList.splice(getIndex, 1);
    localStorage.setItem('transactionsList', JSON.stringify(itemsList));

}

//save the text in input in LocalStorage 
function saveInput(evento, quantity, concept){

    let transaction = {
        concepto: concept,
        cantidad: quantity,
        id: evento,
    }
    itemsList.push(transaction)

    localStorage.setItem('transactionsList', JSON.stringify(itemsList));

}

//save in LocalStorage the ingresos, gastos and ahorro
function saveData() {
    const IngresosElement = document.querySelector("#ingreso")
    const gastosElement = document.querySelector("#gasto")
    const ahorroElement = document.querySelector("#ahorro")

    localStorage.setItem("ingreso", IngresosElement.innerText)
    localStorage.setItem("gasto", gastosElement.innerText)
    localStorage.setItem("ahorro", ahorroElement.innerText)
}

//save in LocalStorage the evento value
function saveEvento () {
    localStorage.setItem("evento", evento);
}

function resetAll() {
    //clear storage
    localStorage.clear();

    //clear inputs
    clearInputs();

    //clear data 
    historialElement.innerHTML = "<h2>Historial</h2><hr>"

    const IngresosElement = document.querySelector("#ingreso")
    const gastosElement = document.querySelector("#gasto")
    const ahorroElement = document.querySelector("#ahorro")
    IngresosElement.innerText = "0.00€"
    gastosElement.innerText = "0.00€"
    ahorroElement.innerText = "0.00€"

    //reset evento
    evento = 0
    localStorage.setItem("evento", evento)
    
}

resetButton.addEventListener("click", resetAll)



