interface Shape {
  draw(): void;
}
class Circle implements Shape {
  draw(): void {
    console.log("Drawing a circle");
  }
}
class Square implements Shape {
  draw(): void {
    console.log("Drawing a square");
  }
}
class ShapeGroup implements Shape {
  private shapes: Shape[] = [];
  constructor(shapes?: Shape[]) {
    if (shapes) {
      this.shapes = shapes;
    }
  }
  add(shape: Shape): void {
    this.shapes.push(shape);
  }
  draw(): void {
    console.log("Drawing a group of shapes:");
    for (let shape of this.shapes) {
      shape.draw();
    }
  }
}
const circle = new Circle();
const square = new Square();
const group1 = new ShapeGroup([circle, square]);
const anotherCircle = new Circle();
group1.add(anotherCircle);
group1.draw();
