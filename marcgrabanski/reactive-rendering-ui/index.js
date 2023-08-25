function PizzaRecipe(pizza) {
  return `<div class="pizza-recipe">
    <h1>${pizza.name}</h1>
    <h3>Toppings: ${pizza.toppings.join(", ")}</h3>
    <p>${pizza.description}</p>
  </div>`;
}

function PizzaRecipeList(pizzas) {
  return `<div class="pizza-recipe-list">
    ${pizzas.map(PizzaRecipe).join("")}
  </div>`;
}

var allPizzas = [
  {
    name: "Margherita",
    toppings: ["tomato sauce", "mozzarella"],
    description: "A classic pizza with fresh ingredients.",
  },
  {
    name: "Pepperoni",
    toppings: ["tomato sauce", "mozzarella", "pepperoni"],
    description: "A favorite among many, topped with delicious pepperoni.",
  },
  {
    name: "Veggie Supreme",
    toppings: [
      "tomato sauce",
      "mozzarella",
      "bell peppers",
      "onions",
      "mushrooms",
    ],
    description: "A delightful vegetable-packed pizza.",
  },
];

// Render the list of pizzas
function renderPizzas() {
  document.querySelector("body").innerHTML = PizzaRecipeList(allPizzas);
}

renderPizzas(); // Initial render

// Example of changing data and re-rendering
function addPizza() {
  allPizzas.push({
    name: "Hawaiian",
    toppings: ["tomato sauce", "mozzarella", "ham", "pineapple"],
    description: "A tropical twist with ham and pineapple.",
  });

  renderPizzas(); // Re-render the updated list
}

// Call this function to add a new pizza and re-render the list
addPizza();
