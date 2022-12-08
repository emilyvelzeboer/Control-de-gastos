//main locations
const inputConcepto = document.querySelector('#inputConcepto')
const inputCantidad = document.querySelector('#inputCantidad')
const buttonElement = document.querySelector('#buttonElement')
const historialElement = document.querySelector(".historial")


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

    if (items_from_storage.length > 0) {
    for (let index = 0; index < items_from_storage.length; index++) {

        let getConcepto = items_from_storage[index].concepto
        let getCantidad = items_from_storage[index].cantidad
        let getValueID = items_from_storage[index].id

        const newDivElement = document.createElement("div")
        newDivElement.setAttribute("class", `historicalBlock${getValueID}`)
        newDivElement.setAttribute("id", "historicalBlock")
        const newHistoricalBlock = historialElement.appendChild(newDivElement)
        newHistoricalBlock.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/1024px-Red_X.svg.png" alt="x" onclick="deleteLineOfHistory(${getValueID})" id="lineOfHistory${getValueID}">
        <div>
            <p id = "conceptoEnElHistorial${getValueID}"> ${getConcepto} </p>
            <p id = "cantidadEnElHistorial${getValueID}"> ${getCantidad}€ </p>
        </div>`

        itemsList.push(items_from_storage[index])

    }}else {
        //reset evento
        evento = 0
        localStorage.setItem("evento", evento)
    }
}


displayHistoricaltransactions()


//when the button "Anadir transaccion" is clicked: history of transactions updates as well as ingresos, gastos and ahorro
function addTransaction () {
    addLineHistorical ()
    updateIngresosYGastosYAhorro()
    clearInputs()

}

buttonElement.addEventListener("click", addTransaction)

    
//add a line with the transaction details in the Historial section with input values
function addLineHistorical () {
    const inputConcepto = document.querySelector('#inputConcepto')
    const inputCantidad = document.querySelector('#inputCantidad')

    //assign a standard value to empty fields in input
    if (inputCantidad.value == '') {
        inputCantidad.value = 0
    }
    
    if (inputConcepto.value == '') {
        inputConcepto.value = 'transacción'
    }

    //add transaction in the history
    const newDivElement = document.createElement("div")
    newDivElement.setAttribute("class", `historicalBlock${evento}`)
    newDivElement.setAttribute("id", "historicalBlock")
    const newHistoricalBlock = historialElement.appendChild(newDivElement)

    newHistoricalBlock.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/1024px-Red_X.svg.png" alt="x" onclick="deleteLineOfHistory(${evento})" id="lineOfHistory${evento}"> 
    <div>
        <p id = "conceptoEnElHistorial${evento}"> ${inputConcepto.value} </p>
        <p id = "cantidadEnElHistorial${evento}"> ${inputCantidad.value}€ </p>
    </div>`

    //save in local storage
    saveInput(evento)

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
        IngresosElement.innerText = amount_ingreso + '€'

        ahorroElement.innerText = parseFloat(ahorroElement.innerText) + parseFloat(inputCantidad.value) + '€'

    } else if (parseFloat(inputCantidad.value)<0){
        let amount_gasto = parseFloat(inputCantidad.value) + parseFloat(gastosElement.innerText)
        gastosElement.innerText = amount_gasto + '€'

        ahorroElement.innerText = parseFloat(ahorroElement.innerText) + parseFloat(inputCantidad.value) + '€'
    }

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
        IngresosElement.innerText = amount_ingreso + '€'

        ahorroElement.innerText = parseFloat(ahorroElement.innerText) - parseFloat(newElement.innerText) + '€'

    } else if (parseFloat(newElement.innerText) < 0) {
        const gastosElement = document.querySelector("#gasto")
        let amount_gasto = parseFloat(gastosElement.innerText) - parseFloat(newElement.innerText)
        gastosElement.innerText = amount_gasto + '€'

        ahorroElement.innerText = parseFloat(ahorroElement.innerText) - parseFloat(newElement.innerText) + '€'

    }

    saveData()

    //updateoggetto
    items_from_storage = JSON.parse(localStorage.getItem("transactionsList"))
    const getIndex = itemsList.map(object => object.id).indexOf(evento);
    itemsList.splice(getIndex, 1);
    localStorage.setItem('transactionsList', JSON.stringify(itemsList));

}

//save the text in input in LocalStorage 
function saveInput(evento){

    const inputConcepto = document.querySelector('#inputConcepto')
    const inputCantidad = document.querySelector('#inputCantidad')

    let transaction = {
        concepto: inputConcepto.value,
        cantidad: parseFloat(inputCantidad.value),
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
    localStorage.setItem("evento", evento)
}


