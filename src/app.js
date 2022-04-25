var transactionsResponse

const tdTotalValue = document.getElementById('totalValue');

function drawTable() {
    document.getElementById("tableBody").innerHTML = ''
    listTable().then((list) => {
        list.map((item) => {
            document.getElementById("tableBody").innerHTML += `
            <tr>
                <td>${item.type === 'compra' ? '-' : '+'}</td>
                <td>${item.name}</td>
                <td>${item.value}</td>
            </tr>
            `
        })
    })
}

function validationFields() {
    const name = document.querySelector("#name")
    const value = document.querySelector("#value")

    if(name === '' || value === '') {
        alert("Preencha todos os campos!")
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
                                value: value
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
    if (transactionsResponse.records.length) {
        const name = document.querySelector("#name").value
        const value = document.querySelector("#value").value
        const type = document.querySelector("#type").value
        let data = JSON.parse(transactionsResponse?.records[0]?.fields?.Json || '[]')
        data = [...data, {
            type: type,
            name: name,
            value: value
        }]
        patchTransactions(
            JSON.stringify(data)
        )
    }
    else {
        insertTable()
    }


}

function addTransaction(transaction) {
    document.getElementById("tableBody").innerHTML += `
            <tr>
                <td>${transaction[0] === 'compra' ? '-' : '+'}</td>
                <td>${transaction[1]}</td>
                <td>${transaction[2]}</td>
            </tr>
            `
}

async function total(allTrasactions) {

    let totalTransaction = 0;

    await allTrasactions.forEach(transactionsValue => {

        if (transactionsValue.type === '-') {
            totalTransaction -= Number(transactionsValue.value)
        }
        else if (transactionsValue.type === '+') {
            totalTransaction += Number(transactionsValue.value)
        }
    })

    if (totalTransaction < 0) {

    }

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
