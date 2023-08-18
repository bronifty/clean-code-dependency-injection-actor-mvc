interface DrawingStrategy {
  draw(): void;
}
class SolidLineDrawing implements DrawingStrategy {
  draw(): void {
    console.log("Drawing with solid lines");
  }
}
class DottedLineDrawing implements DrawingStrategy {
  draw(): void {
    console.log("Drawing with dotted lines");
  }
}
class Shape {
  private drawingStrategy: DrawingStrategy;
  constructor(drawingStrategy: DrawingStrategy) {
    this.drawingStrategy = drawingStrategy;
  }
  setStrategy(strategy: DrawingStrategy) {
    this.drawingStrategy = strategy;
  }
  drawShape(): void {
    this.drawingStrategy.draw();
  }
}
const solidDrawing = new SolidLineDrawing();
const shape = new Shape(solidDrawing);
shape.drawShape();
const dottedDrawing = new DottedLineDrawing();
shape.setStrategy(dottedDrawing);
shape.drawShape();
