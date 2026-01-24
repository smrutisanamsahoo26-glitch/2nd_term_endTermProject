const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");

const incomeSpan = document.getElementById("income");
const expenseSpan = document.getElementById("expense");
const balanceSpan = document.getElementById("balance");

const barChart = document.getElementById("barChart");
const incomePie = document.getElementById("incomePie");
const expensePie = document.getElementById("expensePie");

const transactionList = document.getElementById("transactionList");

const goalAmount = document.getElementById("goalAmount");
const monthlySave = document.getElementById("monthlySave");
const goalProgress = document.getElementById("goalProgress");

const subName = document.getElementById("subName");
const subAmount = document.getElementById("subAmount");
const subsList = document.getElementById("subsList");

let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
let subscriptions=[];

function saveTransactions(){
    localStorage.setItem("transactions",JSON.stringify(transactions))
}

function addTransaction(){
    let amount=Number(amountInput.value)
    if(amount<=0){
        return alert("please give a valid number");
    }
    transactions.push({
        amount,
        "type":typeSelect.value,
        "category":categorySelect.value
    });
    saveTransactions();
    updateUI()
}

function updateUI(){
    const income=transactions
      .filter(t=>t.type==='income')
      .reduce((s,t)=>s+t.amount,0);
    
    const expense=transactions
      .filter(t=>t.type==="expense")
      .reduce((s,t)=>s+t.amount,0)

    incomeSpan.innerText="₹"+income;
    expenseSpan.innerText="₹"+expense
    balanceSpan.innerText="₹"+(income-expense)

    transactionList.innerHTML="";
    transactions.forEach((t,i)=>{
        const li=document.createElement("li")
        li.innerHTML=`${t.category} (${t.type}) ₹${t.amount}
          <button onclick="deleteTx(${i})">❌</button>`
        transactionList.appendChild(li);
    })

    drawBarChart()
    drawPie(income,expense);
}

function deleteTx(i){
    transactions.splice(i,1);
    saveTransactions()
    updateUI();
}

function drawBarChart(){
    barChart.innerHTML=""
    const data={};

    transactions.forEach(t=>{
        if(t.type==="expense"){
            data[t.category]=(data[t.category] || 0) + t.amount;
        }
    })

    const max=Math.max(...Object.values(data),1);

    for(let c in data){
        const div=document.createElement("div")
        div.style.width = (data[c] / max) * 100 + "%";
        div.innerText = `${c} ₹${data[c]}`;
        barChart.appendChild(div);
    }
}

function drawPie(income,expense){
    const total=income+expense || 1;
    incomePie.style.width = (income / total) * 100 + "%";
    expensePie.style.width = (expense / total) * 100 + "%";
}

function setGoal(){
    let g=Number(goalAmount.value)
    let m=Number(monthlySave.value)

    if (g<=0 || m<=0) return alert("please give a valid number");
;

    goalProgress.innerText =`Goal ₹${g} → ${Math.ceil(g / m)} months required`;;
}

function addSubscription(){
    if(Number(subAmount.value)<=0){
        return alert("please give a valid number");
    }else{
        subscriptions.push({
            name: subName.value,
            amount: Number(subAmount.value)
        })
        subsList.innerHTML = "";
        let total = 0;

        subscriptions.forEach(s => {
            total += s.amount;
            subsList.innerHTML += `<li>${s.name} ₹${s.amount}</li>`;
        });

        subsList.innerHTML += `<li><b>Total Monthly: ₹${total}</b></li>`;
    }
}

updateUI()




