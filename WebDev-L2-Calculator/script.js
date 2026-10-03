const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.textContent = currentValue;
    previousDisplay.textContent =
        previousValue && operator
            ? `${previousValue} ${getOperatorSymbol(operator)}`
            : "";
}

function getOperatorSymbol(op) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[op] || op;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (selectedOperator === "%" && currentValue !== "0") {
        currentValue = String(parseFloat(currentValue) / 100);
        updateDisplay();
        return;
    }

    if (operator && previousValue && !shouldResetDisplay) {
        calculate();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    shouldResetDisplay = true;

    updateDisplay();
}

function calculate() {
    if (!operator || previousValue === "") {
        return;
    }

    const first = parseFloat(previousValue);
    const second = parseFloat(currentValue);

    if (operator === "/" && second === 0) {
        currentValue = "Cannot divide by 0";
        previousValue = "";
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
        return;
    }

    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":
            result = first / second;
            break;

        default:
            return;
    }

    result = Number(result.toFixed(10));

    currentValue = String(result);
    previousValue = "";
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    operator = null;
    shouldResetDisplay = false;

    updateDisplay();
}

function backspace() {
    if (
        currentValue === "Cannot divide by 0" ||
        currentValue.length <= 1
    ) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);

document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document.querySelector('[data-action="backspace"]')
    .addEventListener("click", backspace);

document.addEventListener("keydown", event => {
    const key = event.key;

    if (!isNaN(key) || key === ".") {
        appendNumber(key);
    }

    if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    if (key === "Escape") {
        clearCalculator();
    }

    if (key === "Backspace") {
        backspace();
    }
});