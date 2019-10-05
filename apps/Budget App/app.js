/*
BUDGET CONTROLLER
---------------------------- */
let budgetController = (function(){

    const Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = (value, totalIncome) => {
        if(totalIncome > 0) {
            this.percentage = Math.round((value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    }

    Expense.prototype.getPercentage = () => {
        return this.percentage;
    };

    const Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    // Keeps all data in one structure
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };
    
    const calculateTotal = (type) => {
        let sum = 0;

        data.allItems[type].map(item => {
            sum += item.value;
        })

        return data.totals[type] = sum;
    }

    return {
        addItem: function(type, desc, value){
            let newItem, ID;
            
            // Create ID 
            // Last number of item id + 1
            // if no items start at 0
            if (data.allItems[type].length === 0){
                ID = 0
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            //Create new item
            if(type === "exp"){
                newItem = new Expense(ID, desc, value);
            } else if(type === "inc") {
                newItem = new Income(ID, desc, value);
            }
            
            // Push item into data structure
            data.allItems[type].push(newItem)
            
            return newItem;
        },
        deleteItem: function(type, id) {
            const filteredData = data.allItems[type].filter(item => item.id !== id)
            data.allItems[type] = filteredData; 
        },
        test: function() {
            return console.log(data);
        },

        calculateBudget: function(){
            // calculate total income and exp
            calculateTotal("exp");
            calculateTotal("inc");

            // total budget
            data.budget = data.totals.inc - data.totals.exp;

            // % of income that is our expenses
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1
            }
        },
        calculatePercentages: () => {
            data.allItems.exp.forEach((current) => {
                current.calcPercentage(current.value, data.totals.inc);
            })
        },
        getBudget: function() {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        getPercentages: () => {
            let allPercentages = data.allItems.exp.map(item => {
                return item.getPercentage();
            });

            return allPercentages;
        }
    }

})();


/*
UI ELEMENT CONTROLLER
---------------------------- */
let UIController = (function(){

    const DOMElements = {
        inputType: document.querySelector(".add__type"),
        inputDesc: document.querySelector(".add__description"),
        inputAmount: document.querySelector(".add__value"),
        addBtn: document.querySelector(".add__btn"),
        incomeList: document.querySelector(".income__list"),
        expensesList: document.querySelector(".expenses__list"),
        expensesValue: document.querySelector(".budget__expenses--value"),
        incomeValue: document.querySelector(".budget__income--value"),
        totalPercentage: document.querySelector(".budget__expenses--percentage"),
        budget: document.querySelector(".budget__value"),
        container: document.querySelector(".container")
    };

    return {
        getInput: function(){
            return {
                type: DOMElements.inputType.value,
                desc: DOMElements.inputDesc.value,
                amount: DOMElements.inputAmount.value,
            }     
        },
        getDOMElements: function(){
            return DOMElements;
        },
        clearInputs: function(){
             document.querySelectorAll(".add__description, .add__value").forEach(input =>  {
                    input.value = "";
                    DOMElements.inputDesc.focus();
                });
        },
        addListItem: function(obj, type) {
            let html;

            if(type === "inc") {
                html = `
                    <div class="item clearfix" id="inc-${obj.id}">
                        <div class="item__description">${obj.desc}</div>
                        <div class="right clearfix">
                            <div class="item__value">+ ${obj.value}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                
                DOMElements.incomeList.insertAdjacentHTML("beforeend", html);
            } else {
                html = `
                    <div class="item clearfix" id="exp-${obj.id}">
                        <div class="item__description">${obj.desc}</div>
                        <div class="right clearfix">
                            <div class="item__value">- ${obj.value}</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                `;

                DOMElements.expensesList.insertAdjacentHTML("beforeend", html);
            }
        },
        deleteListItem: function(item) {
            // DOMElements.container.childNode.removeChild(item);
            item.parentNode.removeChild(item);
        },
        updateBudgetScreens: function(data) {
            DOMElements.incomeValue.textContent = `+${data.totalInc}`;
            DOMElements.expensesValue.textContent = `-${data.totalExp}`;

            // Check if percentage is valid
            if(data.percentage !== -1) {
                DOMElements.totalPercentage.textContent = `${data.percentage}%`;
            } else {
                DOMElements.totalPercentage.textContent = `---`;
            }
            
            // Show "+" sign
            if(data.budget > 0) {
                DOMElements.budget.textContent = `+${data.budget}`
            } else {
                DOMElements.budget.textContent = `${data.budget}`
            }
        },
    }

})();


/*
APP CONTROLLER
---------------------------- */
let AppController = (function(budget, UI){

    const setupEventListeners = () => {
        const DOM = UI.getDOMElements();

        // Add new item on btn click
        DOM.addBtn.addEventListener("click", addNewItem);

        // Add new item on enter keypress
        document.addEventListener("keypress", (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                addNewItem();
            }
        })

        // Delete items from the list
        DOM.container.addEventListener("click", deleteItem);

    }

    const updatePercentages = () => {
        budget.calculatePercentages()

        const percentages = budget.getPercentages();
        console.log(percentages);
    }

    const updateBudget = () => {
        budget.calculateBudget();

        const budgetData = budget.getBudget();

        UI.updateBudgetScreens(budgetData);
    };

    const addNewItem = () => {
        const input = UI.getInput();
        // Check if inputs are not empty
        if (input.desc.trim() !== "" && input.amount.trim() !== "" && parseFloat(input.amount) > 0 ) {
            const newItem = budget.addItem(input.type, input.desc, parseFloat(input.amount));
    
            UI.clearInputs();
            UI.addListItem(newItem, input.type);
    
            updateBudget();
            updatePercentages();
        } else {
            alert("Fields can't be left empty");
        }
    }

    const deleteItem = (e) => {
        const itemID = e.target.parentNode.parentNode.parentNode.parentNode;
        
        if(itemID) {
            let type, id, splitID;
            
            // split id into type & id
            splitID = itemID.id.split("-");
            type = splitID[0];
            id = parseInt(splitID[1]);

            // Delete item from the data structure
            budget.deleteItem(type, id);
            // Delete item from UI
            UI.deleteListItem(itemID);
            // Update budget
            updateBudget();
            updatePercentages();

        }
    }



    return {
        init: function(){
            console.log("----------------------------")
            console.log("Application has started.")
            console.log("----------------------------")
            setupEventListeners();
            console.log("Event listeners ready")
            UI.updateBudgetScreens({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1
            })
            console.log("Screens reseted")
        }
    }
})(budgetController, UIController);




// Initialize application
AppController.init();
