const mainDiv = document.querySelector(".main");
const apiUrl = "http://localhost:1337";
let allFood = [];

const addFoodForm = document.forms.addFood;
const foodTitle = addFoodForm.foodTitle;
const expirationDateField = addFoodForm.expirationDate;

addFoodForm.addEventListener("submit", addFood);
let lastItemAdded = null;
let flashTimeout;
// "Event Delegation" : on delegue la gestion de l'evenement (clic sur la croix) a l'element parent plutot que gerer un nouvel event dynamiquement à la creation du list-item
mainDiv.addEventListener("click", deleteFoodItem)

function init() {
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
    const locale_date = convertInLocaleDate(f.expiration_date);
    const foodItem = `<li id="${f.id}"><button data-id="${f.id}" title="Supprimer l'element">❌</button> ${f.title} : ⏲ -> ${locale_date}</li>`;
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

function deleteFoodItem(e) {
  // console.dir(e.target)
  // Verifie que l'element sur lequel on clique est un bouton, si ce n'est pas le cas on ne fait rien
  if (e.target.nodeName.toLowerCase() !== "button") {
    return
  }
  const parentEltId = e.target.parentElement.id;
  fetch(`${apiUrl}/fooditems/${parentEltId}`, {
    method: "DELETE"
  })
    .then(res => {
      console.log(res.json());
      getFood();
    })
  // console.log(parentEltId)
}

function flashLastItemAdded(item) {
  // console.log(item);
  const lastItemAddedElt = document.getElementById(`${item}`);
  lastItemAddedElt.classList.add("flashed");
  flashTimeout = setTimeout(() => {
    lastItemAddedElt.classList.remove("flashed");
    lastItemAdded = null;
  }, 900);
  // clearTimeout(flashTimeout);
}

function convertInLocaleDate(dateString) {
  const dateToConvert = new Date(dateString);
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return dateToConvert.toLocaleDateString('fr-FR', dateOptions)
}

init();