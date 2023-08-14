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
