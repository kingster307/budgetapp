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


    let data = {

        allItems: {
            exp: [],
            inc: [],
        },

        totals: {
            exp: 0,
            inc: 0,
        }

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

            //test(newItem);

            return newItem;
        },
        // data: data,

        // test: (obj) => {
        //    console.log(data); 
        // }
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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = domStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with actual data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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

    }
    let updateBudget = () => {

        //calculate the bidget 

        //returns the budget && does nothing else 

        //



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

    return {
        init: () => {
            setUpEventListen();
            console.log("application initialized")
        }
    }


})(budgetController, uiController);

//entry point 
controller.init();