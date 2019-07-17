let budgetController = (() => {

    //function expression capital first letter 
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function (){
        return this.percentage;
    }

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
        calculatePercentages: () => {

            data.allItems.exp.forEach((cur)=>{
                cur.calcPercentage(data.totals.inc);
            });

        },
        getPercentages: ()=>{

            let allPercentages = data.allItems.exp.map((cur)=>{
                return cur.getPercentage();
            })
            return allPercentages;

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
        exspensesPercentageLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
    };

    let formatNumber = (num, type) =>{
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

       int = numSplit[0];
       dec = numSplit[1]

       if (int.length > 3){
           int = int.substr(0, int.length-3) + "," + int.substr(int.length-3, 3);
       }
       return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
    };

    let nodeListForEach = (list, callback) => {
        for(let i =0; i < list.length; i++ ){
            callback(list[i], i);
        }
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

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
            let type;

            obj.budget > 0 ? type = "inc" : type = "exp";

            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(domStrings.iccomeLabel).textContent = formatNumber(obj.totalInc, "inc");
            document.querySelector(domStrings.expenseLabel).textContent = formatNumber(obj.totalExp, "exp");
            
                
            if (obj.percentage > 0){
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + "%";
            }else{
                document.querySelector(domStrings.percentageLabel).textContent =  "---";
            }


        },
        displayPercentages: (percentages) =>{


            let fields = document.querySelectorAll(domStrings.exspensesPercentageLabel)
            
            nodeListForEach(fields, (current, index)=>{
               
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + "%"
                } else {
                    current.textContent = "---";
                }
            })
        },

        displayMonth: () => {
            let now = new Date(),
                year = now.getFullYear(),
                month = now.getMonth(),
                months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            document.querySelector(domStrings.dateLabel).textContent = `${months[month]} ${year}`;
        },
        changedType: () => {

           let fields = document.querySelectorAll(`${domStrings.inputType}, ${domStrings.inputDescription}, ${domStrings.inputValue}`);

            nodeListForEach(fields, (currentEl) => {
                currentEl.classList.toggle('red-focus');
            });

            document.querySelector(domStrings.inputBtn).classList.toggle("red");

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

        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);

    }
    let updateBudget = () => {

        //calculate the bidget 
        budgetCtrl.calculateBudget();
        //returns the budget && does nothing else 
        let budget = budgetCtrl.getBudget();
        //show on UI
        uiController.displayBudget(budget);

    }
    let updatePercentages = () => {

        budgetCtrl.calculatePercentages();

        let percentages = budgetCtrl.getPercentages();

        uiCtrl.displayPercentages(percentages);

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
            updatePercentages();
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

            updatePercentages();

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
            uiController.displayMonth();
        }
    }


})(budgetController, uiController);

//entry point 
controller.init();