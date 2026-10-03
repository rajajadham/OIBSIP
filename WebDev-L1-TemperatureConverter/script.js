const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");

const convertBtn = document.getElementById("convertBtn");
const clearBtn = document.getElementById("clearBtn");

const resultValue = document.getElementById("resultValue");
const errorMessage = document.getElementById("error");


convertBtn.addEventListener("click", convertTemperature);


clearBtn.addEventListener("click", clearConverter);


function convertTemperature() {

    const temperature = Number(temperatureInput.value);

    const unit = unitSelect.value;


    // Empty input validation

    if (temperatureInput.value.trim() === "") {

        showError("Please enter a temperature.");

        return;
    }


    // Numeric validation

    if (!Number.isFinite(temperature)) {

        showError("Please enter a valid number.");

        return;
    }


    // Absolute zero validation

    if (unit === "celsius" && temperature < -273.15) {

        showError(
            "Celsius cannot be below -273.15°C."
        );

        return;
    }


    if (unit === "fahrenheit" && temperature < -459.67) {

        showError(
            "Fahrenheit cannot be below -459.67°F."
        );

        return;
    }


    if (unit === "kelvin" && temperature < 0) {

        showError(
            "Kelvin cannot be below 0 K."
        );

        return;
    }


    let celsius;
    let fahrenheit;
    let kelvin;


    // Convert input to Celsius first

    if (unit === "celsius") {

        celsius = temperature;

    } else if (unit === "fahrenheit") {

        celsius = (temperature - 32) * 5 / 9;

    } else {

        celsius = temperature - 273.15;
    }


    // Convert Celsius to all units

    fahrenheit = (celsius * 9 / 5) + 32;

    kelvin = celsius + 273.15;


    // Display result

    resultValue.innerHTML = `
        ${formatNumber(celsius)} °C
        <br>
        ${formatNumber(fahrenheit)} °F
        <br>
        ${formatNumber(kelvin)} K
    `;


    clearError();
}


function formatNumber(number) {

    return Number(number.toFixed(2));
}


function showError(message) {

    errorMessage.textContent = message;

    resultValue.innerHTML = "—";
}


function clearError() {

    errorMessage.textContent = "";
}


function clearConverter() {

    temperatureInput.value = "";

    unitSelect.value = "celsius";

    resultValue.innerHTML = "—";

    clearError();

    temperatureInput.focus();
}