const grid = document.querySelector(".grid");
const header = document.querySelector(".header");
const currency1 = document.querySelector(".currency1");
const currency2 = document.querySelector(".currency2");
const input = document.querySelector(".from-amount");
const output = document.querySelector(".to-amount");
const toggleBtn = document.getElementById("toggleBtn");
const calcField = document.querySelectorAll(".widget__calc-field");
let chosenCurrency1;
let chosenCurrency2;
let exchangeRate1;
let exchangeRate2;
let data;

async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

(async function myFunc() {
  const data = await fetchData(
    "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
  );

  data[data.length] = {
    r030: 1,
    txt: "Гривня",
    rate: 1,
    cc: "UAH",
    exchangedate: data[0].exchangedate,
  };

  // Створюємо елементи <option> всередині <select>.
  data.forEach((element) => {
    let option = document.createElement("option");
    option.innerHTML = element.cc;
    currency1.appendChild(option);
  });

  // Копіюємо лист валют з першого селекту до другого.
  const currency2 = currency1.cloneNode(true);
  currency2.classList.replace("currency1", "currency2");
  calcField[1].insertAdjacentElement("afterbegin", currency2);

  // Обираємо валюти за замовчуванням.
  data.forEach((element) => {
    if (element.r030 === 1) {
      let defaultCurrency1 = document.querySelectorAll(".currency1>option")[61]; // UAH
      defaultCurrency1.setAttribute("selected", true);
      chosenCurrency1 = defaultCurrency1;
      exchangeRate1 = element.rate;
      getResult();
    }

    if (element.r030 === 840) {
      let defaultCurrency2 = document.querySelectorAll(".currency2>option")[24]; // USD
      defaultCurrency2.setAttribute("selected", true);
      chosenCurrency2 = defaultCurrency2;
      exchangeRate2 = element.rate;
      getResult();
    }
  });

  // Отримуємо результат при обиранні іншої валюти в першому або другому полі.
  currency1.addEventListener("change", () => {
    data.forEach((element) => {
      if (element.cc === currency1.options[currency1.selectedIndex].innerHTML) {
        exchangeRate1 = element.rate;
      }
    });

    getResult();
  });

  currency2.addEventListener("change", () => {
    data.forEach((element) => {
      if (element.cc === currency2.options[currency2.selectedIndex].innerHTML) {
        exchangeRate2 = element.rate;
      }
    });

    getResult();
  });

  // Свапнути обрані валюти
  toggleBtn.addEventListener("click", () => {
    swapit(currency1, currency2);
    getResult();
  });
})();

function swapit(currency1, currency2) {
  let temp;
  let temp1;

  temp = currency2.value;
  currency2.value = currency1.value;
  currency1.value = temp;

  temp1 = exchangeRate1;
  exchangeRate1 = exchangeRate2;
  exchangeRate2 = temp1;
}

let isFromAmount = true;

input.addEventListener("input", () => {
  isFromAmount = true;
  getResult();
});

output.addEventListener("input", () => {
  isFromAmount = false;
  getResult();
});

function getResult() {
  if (exchangeRate1 && exchangeRate2 && isFromAmount) {
    let result = (exchangeRate1 / exchangeRate2) * input.value;
    return (output.value = result.toFixed(2));
  } else if (chosenCurrency1 && chosenCurrency2 && !isFromAmount) {
    let result = (exchangeRate2 / exchangeRate1) * output.value;
    return (input.value = result.toFixed(2));
  }
}
