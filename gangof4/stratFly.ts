interface ITreeSpecies {
  name: string;
  color: string;
  texture: string;
  display(x: number, y: number): void;
}
class TreeSpecies implements ITreeSpecies {
  constructor(
    public name: string,
    public color: string,
    public texture: string
  ) {}
  display(x: number, y: number) {
    console.log(
      `Displaying ${this.name} tree at (${x}, ${y}). Color: ${this.color}, Texture: ${this.texture}`
    );
  }
}
class TreeSpeciesFactory {
  private static speciesMap = new Map<string, ITreeSpecies>();
  static getTreeSpecies(
    name: string,
    color: string,
    texture: string
  ): ITreeSpecies {
    const key = `${name}-${color}-${texture}`;
    if (!this.speciesMap.has(key)) {
      const species = new TreeSpecies(name, color, texture);
      this.speciesMap.set(key, species);
    }
    return this.speciesMap.get(key)!;
  }
}
const oak = TreeSpeciesFactory.getTreeSpecies("Oak", "Green", "Rough");
oak.display(10, 20);
const maple = TreeSpeciesFactory.getTreeSpecies("Maple", "Red", "Smooth");
maple.display(5, 15);
