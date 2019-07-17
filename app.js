let budgetController = (() => {

    //function expression capital first letter 
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((current, index, array) =>{
            sum += current.value;
        });
        data.totals[type] = sum;
    };


    let data = {

        allItems: {
            exp: [],
            inc: [],
        },

        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,

    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID,
                dataType = data.allItems[type];
            if (dataType.length > 0) {
                //finding array in object
                //finding last index of that array 
                //selecting that array 
                //selecting id of that array 
                //adding one to the id 
                ID = dataType[dataType.length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }
            //[type] is in object bracket notation
            //selecting the array to push new item into 
            dataType.push(newItem);
            return newItem;
        },

        deleteItem: (type, id) => {

            //map cycles through array && makes a new one when returned 
           let ids = data.allItems[type].map((current, index, array)=>{
                return current.id;
            })

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }

        },

        test: (obj) => {
           console.log(data); 
        },

        calculateBudget: () => {

            //calculate total income && expenses 
            
            calculateTotal("inc");
            calculateTotal("exp");
            //calculate budget 
                //income - expenses 
            data.budget = data.totals.inc - data.totals.exp;

            //calc percentage of expenses 

            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },
    }

})();


let uiController = (() => {

    let domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        iccomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: ".container",
    }


    return {
        getInput: () => {

            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value),
            }

        },
        addListItem: (obj, type) => {
            // basically building templates from scratch with pure JS 
            let html, newHtml;
            if (type === "inc") {
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = domStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with actual data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListitem: (selectorId) => {
            let el = document.getElementById(selectorId);
            el.parentNode.removeChild(el); 
        }, 
        clearFields: () => {
            let fields, fieldsarr;

            fields = document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValue);

            // fieldsarr = Array.prototype.slice.call(fields);

            // console.log(fieldsarr);

            fields.forEach((currentEl, index, array) => {
                currentEl.value = "";
            });

            fields[0].focus();
        },
        displayBudget: (obj) => {

            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.iccomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expenseLabel).textContent = obj.totalExp;
            
                
            if (obj.percentage > 0){
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + "%";
            }else{
                document.querySelector(domStrings.percentageLabel).textContent =  "---";
            }


        },
        getDomStrings: () => {
            return domStrings;
        },
    }



})();


let controller = ((budgetCtrl, uiCtrl) => {

    let setUpEventListen = () => {
        let DOM = uiCtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (e) => {
            if (parseInt(e.keyCode) === 13 || parseInt(e.which) === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', crtlDeleteitem);


    }
    let updateBudget = () => {

        //calculate the bidget 
        budgetCtrl.calculateBudget();
        //returns the budget && does nothing else 
        let budget = budgetCtrl.getBudget();
        //show on UI
        uiController.displayBudget(budget);

    }
    let ctrlAddItem = () => {
        let input, newItem;
        input = uiCtrl.getInput();
        if (input !== "" && !isNaN(input.value) && input.value > 0) {
            //would be simplier to nest this in an object then pass everything in at once
            newItem = budgetController.addItem(input.type, input.description, input.value);
            uiCtrl.addListItem(newItem, input.type);
            uiCtrl.clearFields();
            updateBudget();
        }else{
            alert("please try again");
        }
    }

    let crtlDeleteitem = (e) =>{

        let itemId, splitId, ID;
       itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId){
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            budgetCtrl.deleteItem(type, ID);

            uiCtrl.deleteListitem(itemId);

            updateBudget();

        }

    }


    return {
        init: () => {
            setUpEventListen();
            console.log("application initialized")
            uiController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
        }
    }


})(budgetController, uiController);

//entry point 
controller.init();