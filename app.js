var transactionsResponse

const tdTotalValue = document.getElementById('totalValue');

function drawTable() {
    document.getElementById("tableBody").innerHTML = ''
    listTable().then((list) => {
        list.map((item) => {
            document.getElementById("tableBody").innerHTML += `
            <tr>
                <td class="column-one-body">${item.type === 'compra' ? '-' : '+'}</td>
                <td class="column-two-body">${item.name}</td>
                <td class="column-three-body">${currency.format(item.value || 0)}</td>
            </tr>
            `
        })
        document.getElementById("totalValue").innerHTML += `
        <th class="column-two-footer">${currency.format(total(list))}</th>
        <br> ${(total(list)) > 0 ? "[Lucro]" : "[Prejuizo]"}
        `
    })

}

function validationFields() {
    const name = document.querySelector("#name").value
    const value = document.querySelector("#value").value

    if(name === '' || value === '') {
        alert("Preencha todos os campos!")
        return false
    }
    else {
        return true
    }

}

async function listTable() {
    const response = await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula=" + encodeURI("({Responsavel} = '1405')"),
        {
            headers: {
                Authorization: "Bearer key2CwkHb0CKumjuM"
            },
        }
    )
    const transactions = await response.json();
    transactionsResponse = transactions
    return JSON.parse(transactions.records[0].fields.Json || '[]')
}

async function insertTable() {
    const name = document.querySelector("#name").value
    const value = document.querySelector("#value").value
    const type = document.querySelector("#type").value
    const insert = await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula=" + encodeURI("({Responsavel} = '1405')"),
        {
            method: 'POST',
            headers: {
                Authorization: "Bearer key2CwkHb0CKumjuM",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                records: [
                    {
                        fields: {
                            Responsavel: '1405',
                            Json: JSON.stringify([{
                                type: type,
                                name: name,
                                value: parseFloat(value.replace(/\D/g, "")) / 100
                            }])
                        }
                    }
                ]
            })
        }
    )

    const transactions = await insert.json();

    console.log(transactions.records[0].fields.Json)

    if (insert.status === 200) {
        const newTransaction = JSON.parse(transactions.records[0].fields.Json)
        addTransaction(newTransaction)
    }
    return transactions

}

function onSubmit() {
    if(validationFields()){
        if (transactionsResponse.records.length) {
            const name = document.querySelector("#name").value
            const value = document.querySelector("#value").value
            const type = document.querySelector("#type").value
            let data = JSON.parse(transactionsResponse?.records[0]?.fields?.Json || '[]')
            data = [...data, {
                type: type,
                name: name,
                value: parseFloat(value.replace(/\D/g, "")) / 100
            }]
            patchTransactions(
                JSON.stringify(data)
            )
        }
        else {
            insertTable()
        }
    }

}

function addTransaction(transaction) {
    document.getElementById("tableBody").innerHTML += `
            <tr>
                <td>${transaction[0] === 'compra' ? '-' : '+'}</td>
                <td>${transaction[1]}</td>
                <td>${currency.format(transaction[2] || 0)}</td>
            </tr>
            `
            // > 0 ? "Lucro" : "Prejuizo"
}

const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
}) 

function total(allTrasactions) {

return allTrasactions.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.value *  (currentValue.type === 'venda' ? 1 : -1))
    }, 0)

}

const deleting = document.querySelector("#deleteTable")
const deleteTransactions = deleting.addEventListener("click", deleteTransaction)

async function deleteTransaction() {
    const confirmed = confirm("Are you sure you want to delete?")

    if (confirmed) {
        patchTransactions('')
    }

}

async function patchTransactions(json) {
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
        {
            method: 'PATCH',
            headers: {
                Authorization: "Bearer key2CwkHb0CKumjuM",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    records: [
                        {
                            id: transactionsResponse.records[0].id,
                            fields: {
                                Responsavel: '1405',
                                Json: json
                            }
                        }
                    ]
                }
            )
        }
    )
    location.reload();
}

function mascaraMoeda(event) {
    const onlyDigits = event.target.value
        .split("")
        .filter(s => /\d/.test(s))
        .join("")
        .padStart(3, "0")
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
    event.target.value = maskCurrency(digitsFloat)
}

function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
    }).format(valor)
}


drawTable()
