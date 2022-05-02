
let romanValue = [
    {
        character: "I",
        value: 1,
        order: 1
    
    },

    {

       character: "V",
       value: 5,
       order: 2
    },

    {
        character: "X",
        value: 10,
        order: 3
    },

    {
        character: "L",
        value: 50,
        order: 4
    },

    {
        character: "C", 
        value: 100,
        order: 5
        
    },
    {
        character: "D",
        value: 500,
        order: 6
    
    },
    {
        character: "M", 
        value: 1000,
        order: 7
    } 

]


function findRomanCharacter(character){

    if(
        character == "I"  || 
        character == "V"  ||
        character == "X"  || 
        character == "L"  || 
        character == "C"  ||
        character == "D"  ||
        character == "M"  
    ){
        return true;
    } 

    return false;
}

function searchRomanCharacterValue(character){

        let objRomanCharacter = romanValue.find(element => element.character == character); 

        return objRomanCharacter != undefined ?  objRomanCharacter.value: 0;

}

function searchRomanCharacterObject(character){

    let objRomanCharacter = romanValue.find(element => element.character == character); 

    return objRomanCharacter != undefined ?  objRomanCharacter: null;

}


function applyRoles(lastCharacter, currentCharacter, valueDecimal){

    let _lastCharacterObject = searchRomanCharacterObject(lastCharacter);
    let _currentCharacterObject = searchRomanCharacterObject(currentCharacter);
    

    
    if(_lastCharacterObject.order >= _currentCharacterObject.order){



        return valueDecimal + _currentCharacterObject.value;

    }else{

        // Os símbolos M e D admitem somente subtração do valor do símbolo C;
        // Os símbolos C e L admitem somente subtração do valor do símbolo X;
        // Os símbolos X e V admitem somente subtração do valor do símbolo I

        if( ( (_lastCharacterObject.order == "5") && (_currentCharacterObject.order == "7" || _currentCharacterObject.order == "6")) ||
            ( (_lastCharacterObject.order == "3") && (_currentCharacterObject.order == "4" || _currentCharacterObject.order == "5")) ||
            ( (_lastCharacterObject.order == "1") && (_currentCharacterObject.order == "2" || _currentCharacterObject.order == "3")) 
        ){
            
           
            return valueDecimal + (_currentCharacterObject.value - (_lastCharacterObject.value*2));
       
        }else{

            return -1;

        }


    }

}


function convertFromRomanToDecimal(str){

    if(str.length == 0){
        return [];
    }

    let decimalValueList = [];
    let romanValueList = [];


    let pointer = 0;
    let buffer = 0;
    str = str.toUpperCase();

    for(let i=0; i < str.length; i++){
        

        if(str.length > 0){

            if(str.length > 3 && i >= 3){

                if(str[i] == str[i-1] && str[i] == str[i-2] && str[i] == str[i-3] ){
                    pointer++;
                    decimalValueList[pointer] = 0;
                    romanValueList[pointer] = '';

                }


            }
            
           
            if(findRomanCharacter(str[i]) && findRomanCharacter(str[i-1])){
                buffer = applyRoles(str[i-1], str[i], decimalValueList[pointer]);
            

                if(buffer != -1){
                    decimalValueList[pointer] = buffer;
                    romanValueList[pointer] = romanValueList[pointer] + str[i];


                }else{
                    pointer++;
                    decimalValueList[pointer] = searchRomanCharacterValue(str[i]);
                    romanValueList[pointer] = str[i];
                }

            }else if(findRomanCharacter(str[i])) { 
                decimalValueList.push(searchRomanCharacterValue(str[i]));
                
                romanValueList.push(str[i]);


            }else if(!findRomanCharacter(str[i]) && findRomanCharacter(str[i-1])){
                pointer++;
            }

        }else if(findRomanCharacter(str[i])) { 
            decimalValueList.push(searchRomanCharacterValue(str[i]));
            
            romanValueList.push(str[i]);
        }

        

    }

    return {values: decimalValueList , numbers: romanValueList};

}

module.exports = function maxRomanNumber(str){

    let maxNumber = 0;
    let indexMaxNumber = -1;
    let objNumber = convertFromRomanToDecimal(str);


    if(objNumber.values.length > 0){
        maxNumber = Math.max(...objNumber.values);
        indexMaxNumber = objNumber.values.indexOf(maxNumber);
    }

    return { 
        value: maxNumber,
        number: indexMaxNumber != -1 ? objNumber.numbers[indexMaxNumber]: '[Absence of roman numeral in sentence]'
    
    }

}
