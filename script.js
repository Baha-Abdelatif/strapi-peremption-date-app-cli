const mainDiv = document.querySelector(".main");
const apiUrl = "http://localhost:1337";
let allFood = [];

const addFoodForm = document.forms.addFood;
const foodTitle = addFoodForm.foodTitle;
const expirationDateField = addFoodForm.expirationDate;

addFoodForm.addEventListener("submit", addFood);

const init = () => {
  getFood();
}
function getFood() {
  fetch(`${apiUrl}/fooditems?_sort=Expiration_date:ASC`)
    .then(data => data.json())
    .then(result => {
      allFood = result;
      renderFood(allFood);
    })
    .catch(err => { console.error(err) })
}
function renderFood(food) {
  let foodList = [];
  food.forEach(f => {
    const foodItem = `<li>${f.title}</li>`;
    foodList = [...foodList, foodItem];
  })
  mainDiv.innerHTML = `<h2>Liste des plats :</h2><ul>${foodList.join("")}</ul>`
}
function addFood(e) {
  // Liste les propriétés disponibles de l'event
  // console.dir(e.target)
  e.preventDefault();
  const title = foodTitle.value.trim();
  const expiration_date = expirationDateField.value;
  const payload = {
    title,
    expiration_date,
    category: 'default'
  }
  fetch(`${apiUrl}/fooditems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      foodTitle.value = "";
      expirationDateField.value = "";
      getFood();
    })
    .catch(err => { console.error(err) })
}

init();