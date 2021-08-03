const mainDiv = document.querySelector(".main");
const apiUrl = "http://localhost:1337";
let allFood = [];

const init = () => {
  getFood();
}
const getFood = () => {
  fetch(`${apiUrl}/fooditems?_sort=Expiration_date:ASC`)
    .then(data => data.json())
    .then(result => {
      allFood = result;
      renderFood(allFood);
    })
    .catch(err => { console.error(err) })
}
const renderFood = (food) => {
  let foodList = [];
  food.forEach(f => {
    const foodItem = `<li>${f.title}</li>`;
    foodList = [...foodList, foodItem];
  })
  mainDiv.innerHTML = `<h2>Liste des plats :</h2><ul>${foodList.join("")}</ul>`
}
init();