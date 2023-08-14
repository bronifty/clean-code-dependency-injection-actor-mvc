class ProductModel {
  constructor(public name: string, public price: number) {}
}
class ProductView {
  render(products: ProductModel[]) {
    products.forEach((product) => {
      console.log(`Name: ${product.name}, Price: ${product.price}`);
    });
  }
}
class ProductController {
  constructor(
    private products: ProductModel[],
    private view: ProductView,
    private sortingStrategy: SortingStrategy
  ) {}
  displayProducts() {
    const sortedProducts = this.sortingStrategy.sort(this.products);
    this.view.render(sortedProducts);
  }
  setSortingStrategy(sortingStrategy: SortingStrategy) {
    this.sortingStrategy = sortingStrategy;
  }
}

interface SortingStrategy {
  sort(products: ProductModel[]): ProductModel[];
}
class AscendingPriceSortingStrategy implements SortingStrategy {
  sort(products: ProductModel[]): ProductModel[] {
    return products.sort((a, b) => a.price - b.price);
  }
}
class DescendingPriceSortingStrategy implements SortingStrategy {
  sort(products: ProductModel[]): ProductModel[] {
    return products.sort((a, b) => b.price - a.price);
  }
}
class ProductFactory {
  static createProduct(name: string, price: number): ProductModel {
    return new ProductModel(name, price);
  }
}
class SortingStrategyFactory {
  static createAscendingPriceStrategy(): SortingStrategy {
    return new AscendingPriceSortingStrategy();
  }
  static createDescendingPriceStrategy(): SortingStrategy {
    return new DescendingPriceSortingStrategy();
  }
}

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
