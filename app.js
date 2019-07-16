let budgetController = (() =>{

    let x = 23;

    let add = (a) =>{
        return x + a;
    }

    return{
        publicTest: (b)=>{
            return add(b);
        }
    }

})()

let uiController = ( () =>{

    let domStrings = {
        inputType: '.add__type',
    }


    return {
        getInput: () => {

            return{
                type: document.querySelector(inputType).value,
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value,
            }

        },
    }

})();


let controller = ( (budgetCtrl, uiCtrl) =>{

    let ctrlAddItem = () =>{

        let input = uiCtrl.getInput();
        console.log(input);
    
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);


    document.addEventListener('keypress', (e)=>{
       if(parseInt(e.keyCode) === 13 || parseInt(e.which) === 13){
           ctrlAddItem();
       }
    });



})(budgetController, uiController);