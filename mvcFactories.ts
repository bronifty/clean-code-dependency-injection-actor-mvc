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
