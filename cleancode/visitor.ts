interface Visitor {
  visitConcreteElementA(element: ConcreteElementA): void;
  visitConcreteElementB(element: ConcreteElementB): void;
}
class ConcreteVisitor implements Visitor {
  visitConcreteElementA(element: ConcreteElementA): void {
    console.log("ConcreteVisitor visited ConcreteElementA");
  }
  visitConcreteElementB(element: ConcreteElementB): void {
    console.log("ConcreteVisitor visited ConcreteElementB");
  }
}
interface Element {
  accept(visitor: Visitor): void;
}
class ConcreteElementA implements Element {
  accept(visitor: Visitor): void {
    visitor.visitConcreteElementA(this);
  }
}
class ConcreteElementB implements Element {
  accept(visitor: Visitor): void {
    visitor.visitConcreteElementB(this);
  }
}
class ObjectStructure {
  private elements: Element[] = [];
  addElement(element: Element): void {
    this.elements.push(element);
  }
  acceptVisitor(visitor: Visitor): void {
    for (const element of this.elements) {
      element.accept(visitor);
    }
  }
}
const objectStructure = new ObjectStructure();
objectStructure.addElement(new ConcreteElementA());
objectStructure.addElement(new ConcreteElementB());
const visitor = new ConcreteVisitor();
objectStructure.acceptVisitor(visitor);
