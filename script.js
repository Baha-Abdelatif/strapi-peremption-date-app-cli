const mainDiv = document.querySelector(".main");
const apiUrl = "http://localhost:1337";
let allFood = [];

const init = () => {
  getFood();
}
const getFood = () => {
  fetch(`${apiUrl}/fooditems`)
    .then(data => data.json())
    .then(result => {
      allFood = result;
      console.log('All Food: ', allFood)
    })
    .catch(err => { console.error(err) })
}

init();