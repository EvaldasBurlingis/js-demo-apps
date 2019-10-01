const amountInput = document.querySelector("#amount");
const tipInput = document.querySelector("#tip");
const add = document.querySelector("#add");
const minus = document.querySelector("#minus");
const people = document.querySelector("#people");
const splitTotal = document.querySelector("#splitTotal");


let billTotal;
let tipTotal = tipInput.value;
let totalToPay;
let peopleToSplit = 1;

amountInput.addEventListener("change", (e) => {
    e.preventDefault();
    billTotal = Number(amountInput.value);
    countTotal(billTotal, tipTotal, peopleToSplit);
})

tipInput.addEventListener("change", () => {
    tipTotal = Number(tipInput.value);
    countTotal(billTotal, tipTotal, peopleToSplit);
})

add.addEventListener("click", () => {
    peopleToSplit++;
    people.textContent = peopleToSplit;
    countTotal(billTotal, tipTotal, peopleToSplit);
})

minus.addEventListener("click", () => {
    if(peopleToSplit > 1) {
        peopleToSplit--;
        people.textContent = peopleToSplit;
        countTotal(billTotal, tipTotal, peopleToSplit);
    }
})

function countTotal(amount, tip, people){
    tip = 0.01 * tip;
    let calculateTip = amount * tip;
    totalToPay = (amount + calculateTip) / people;

    splitTotal.textContent = totalToPay.toFixed(2);
}