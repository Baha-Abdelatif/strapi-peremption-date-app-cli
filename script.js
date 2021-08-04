const mainDiv = document.querySelector(".main");
const apiUrl = "http://localhost:1337";
let allFood = [];

const addFoodForm = document.forms.addFood;
const foodTitle = addFoodForm.foodTitle;
const expirationDateField = addFoodForm.expirationDate;

addFoodForm.addEventListener("submit", addFood);
let lastItemAdded = null;
let flashTimeout;

const init = () => {
  getFood();
}
function getFood() {
  fetch(`${apiUrl}/fooditems?_sort=Expiration_date:ASC`)
    .then(data => data.json())
    .then(result => {
      allFood = result;
      renderFood(allFood);
      if (lastItemAdded !== null) {
        flashLastItemAdded(lastItemAdded);
      }
    })
    .catch(err => { console.error(err) })
}
function renderFood(food) {
  let foodList = [];
  food.forEach(f => {
    const foodItem = `<li id="${f.id}">${f.title}</li>`;
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
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      foodTitle.value = "";
      expirationDateField.value = "";
      lastItemAdded = data.id;
      getFood();
    })
    .catch(err => { console.error(err) })
}

function flashLastItemAdded(item) {
  console.log(item);
  const lastItemAddedElt = document.getElementById(`${item}`);
  lastItemAddedElt.classList.add("flashed");
  flashTimeout = setTimeout(() => { lastItemAddedElt.classList.remove("flashed") }, 900);
  // clearTimeout(flashTimeout);
}

init();