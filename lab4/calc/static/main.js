// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

// var oneButton = document.getElementById('one')
// var twoButton = document.getElementById('two')
// var threeButton = document.getElementById('three')
// var fourButton = document.getElementById('four')
// var fiveButton = document.getElementById('five')
// var sixButton = document.getElementById('six')
// var sevenButton = document.getElementById('seven')
// var eightButton = document.getElementById('eight')
// var nineButton = document.getElementById('nine')

var resultString = document.getElementById('resultString')
var flag = true;
var  bracketflag = true;
var errorflag = false;
const calculator = document.querySelector('.calc-container');

calculator.addEventListener('click', function(event) {
    if (event.target.matches('.digit, .operation, .bracket, .result, .clear')) {
    clickHandler(event.target);
}
});


function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    }else if (operation == '*' || operation == '/') {
        return 2;
    }else if (operation == '(' || operation == ')') {
        return 3;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    console.log(str)
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}
// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = [];
    let stack = [];
    console.log(str, ":comaile")
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).

function evaluate(str) {
    const stack = [];

    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };

    const tokens = str.split(' ');

    tokens.forEach(token => {
        if (!isNaN(parseFloat(token))) {
            stack.push(parseFloat(token));
        } else if (token in operators) {
            const b = stack.pop();
            const a = stack.pop();
            const result = operators[token](a, b);
            stack.push(result);
        } else {
            throw new Error('Invalid token: ' + token);
        }
    });

    if (stack.length !== 1) {
        throw new Error('Invalid expression');
    }

    return stack[0].toFixed(2); // Округление до двух знаков после запятой
}


// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.

function clickHandler(even) {
    if(errorflag == true){
        resultString.textContent=""
        errorflag= false
    }
    if(even.className == "key clear"){
        resultString.textContent=""
        flag = true;
        bracketflag = true;
        errorflag = false;
    }
    else if(even.value == "="){
        var result = evaluate(compile(resultString.textContent))
        if(isNaN(result)){
            resultString.textContent = "Error"
            errorflag = true;
        }
        else
            resultString.textContent = evaluate(compile(resultString.textContent))
    }
    else if(even.className == "key digit"){
        resultString.textContent+=even.value
        flag = true;
    }
    else if(even.className == "key operation"){
        if(flag == true){
            resultString.textContent+=even.value
            flag = false
        }
    }
    else if(even.className == "key bracket"){
        if(even.value == "(" && bracketflag == true){
            resultString.textContent+=even.value
            bracketflag = false
        }
        if(even.value == ")" && bracketflag == false){
            resultString.textContent+=even.value
            bracketflag = true
        }
    }
}


// Назначьте нужные обработчики событий.
// digitButton[0].oneclick = function () {
//     console.log(digitButton[0])
// }

