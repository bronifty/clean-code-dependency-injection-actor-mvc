const products = [
  ProductFactory.createProduct("Apple", 1.0),
  ProductFactory.createProduct("Banana", 0.5),
];

const view = new ProductView();
const ascendingStrategy = SortingStrategyFactory.createAscendingPriceStrategy();
const controller = new ProductController(products, view, ascendingStrategy);

controller.displayProducts(); // Displays products sorted by ascending price

const descendingStrategy =
  SortingStrategyFactory.createDescendingPriceStrategy();
controller.setSortingStrategy(descendingStrategy);
controller.displayProducts();
