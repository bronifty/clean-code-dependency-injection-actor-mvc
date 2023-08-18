class Memento {
  private state: string;
  constructor(state: string) {
    this.state = state;
  }
  public getState(): string {
    return this.state;
  }
}
class Originator {
  private state: string;
  public set(state: string): void {
    console.log(`Originator: Setting state to ${state}`);
    this.state = state;
  }
  public saveToMemento(): Memento {
    console.log("Originator: Saving to Memento.");
    return new Memento(this.state);
  }
  public restoreFromMemento(memento: Memento): void {
    this.state = memento.getState();
    console.log(
      `Originator: State after restoring from Memento: ${this.state}`
    );
  }
}
class Caretaker {
  private mementos: Memento[] = [];
  public addMemento(memento: Memento): void {
    this.mementos.push(memento);
  }
  public getMemento(index: number): Memento {
    return this.mementos[index];
  }
}
const originator = new Originator();
const caretaker = new Caretaker();
originator.set("State1");
originator.set("State2");
caretaker.addMemento(originator.saveToMemento());
originator.set("State3");
caretaker.addMemento(originator.saveToMemento());
originator.set("State4");
originator.restoreFromMemento(caretaker.getMemento(0));
originator.restoreFromMemento(caretaker.getMemento(1));
