class TreeSpecies {
  constructor(
    public name: string,
    public color: string,
    public texture: string
  ) {}
  display(extrinsicState: { x: number; y: number; age: number }) {
    console.log(
      `Displaying ${this.name} tree of age ${extrinsicState.age} at position (${extrinsicState.x}, ${extrinsicState.y}). Color: ${this.color}, Texture: ${this.texture}`
    );
  }
}
class TreeFactory {
  private static speciesMap = new Map<string, TreeSpecies>();
  static getTreeSpecies(
    name: string,
    color: string,
    texture: string
  ): TreeSpecies {
    if (!this.speciesMap.has(name)) {
      const species = new TreeSpecies(name, color, texture);
      this.speciesMap.set(name, species);
    }
    return this.speciesMap.get(name)!;
  }
}
const oak = TreeFactory.getTreeSpecies("Oak", "Green", "Rough");
const maple = TreeFactory.getTreeSpecies("Maple", "Red", "Smooth");
oak.display({ x: 10, y: 20, age: 5 });
maple.display({ x: 5, y: 15, age: 10 });
