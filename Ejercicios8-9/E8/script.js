document.getElementById('sum-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const number1 = document.getElementById('number1').value;
    const number2 = document.getElementById('number2').value;

    clearStacks(); // Limpiar las pilas visuales anteriores

    const result = sumLargeNumbers(number1, number2);
    document.getElementById('result-text').textContent = result;
});

function sumLargeNumbers(num1, num2) {
    const stack1 = [];
    const stack2 = [];
    const resultStack = [];
    const carryStack = [];

    // Insertar cada dígito en las pilas
    for (let i = 0; i < num1.length; i++) {
        stack1.push(parseInt(num1[i]));
        visualizeStack('stack1', num1[i]); 
    }
    for (let i = 0; i < num2.length; i++) {
        stack2.push(parseInt(num2[i]));
        visualizeStack('stack2', num2[i]); 
    }

    let carry = 0;

    // Sumar dígito por dígito
    while (stack1.length > 0 || stack2.length > 0 || carry > 0) {
        const digit1 = stack1.length > 0 ? stack1.pop() : 0;
        const digit2 = stack2.length > 0 ? stack2.pop() : 0;

        const sum = digit1 + digit2 + carry;
        resultStack.push(sum % 10);
        carry = Math.floor(sum / 10);

        // Visualizar el resultado parcial y el acarreo
        visualizeStack('result-stack', sum % 10);
        visualizeStack('carry-stack', carry > 0 ? carry : ''); // Mostrar acarreo si existe
    }

    return resultStack.reverse().join('');
}

// Función para visualizar una pila
function visualizeStack(stackId, value) {
    const stackElement = document.getElementById(stackId);
    const valueElement = document.createElement('div');
    valueElement.textContent = value;
    stackElement.appendChild(valueElement);
}

// Función para limpiar las pilas visuales
function clearStacks() {
    document.getElementById('stack1').innerHTML = '';
    document.getElementById('stack2').innerHTML = '';
    document.getElementById('carry-stack').innerHTML = '';
    document.getElementById('result-stack').innerHTML = '';
}
