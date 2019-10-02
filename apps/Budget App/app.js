/*
BUDGET CONTROLLER
---------------------------- */
let budgetController = (function(){

    const Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

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
        }
    };


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
        
        test: function() {
            return console.log(data);
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
        expensesList: document.querySelector(".expenses__list")
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
                DOMElements.inputDesc.value = "";
                DOMElements.inputAmount.value = "";
        },
        addListItem: function(obj, type) {
            let html;

            if(type === "inc") {
                html = `
                    <div class="item clearfix" id="income-${obj.id}">
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
                    <div class="item clearfix" id="expense-${obj.id}">
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


            // Replace placeholder with data
    
            // Insert item into HTML

        }
    }

})();


/*
APPCONTROLLER
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
    }

    const addNewItem = () => {
        const input = UI.getInput();
        const newItem = budget.addItem(input.type, input.desc, input.amount);
        UI.clearInputs();
        UI.addListItem(newItem, input.type);

    }



    return {
        init: function(){
            console.log("----------------------------")
            console.log("Application has started.")
            console.log("----------------------------")
            setupEventListeners();
        }
    }
})(budgetController, UIController);




// Initialize application
AppController.init();
