interface State {
  handle(): void;
}
class ConcreteStateA implements State {
  handle(): void {
    console.log("ConcreteStateA is handling.");
  }
}
class ConcreteStateB implements State {
  handle(): void {
    console.log("ConcreteStateB is handling.");
  }
}
interface Context {
  setState(state: State): void;
  request(): void;
}
class Task implements Context {
  private state: State;
  constructor() {
    this.state = new ConcreteStateA();
  }
  setState(state: State): void {
    this.state = state;
  }
  request(): void {
    this.state.handle();
  }
}
class TaskFactory {
  static createTask(): Context {
    return new Task();
  }
}
const task = TaskFactory.createTask();
task.request(); // Output: ConcreteStateA is handling.
task.setState(new ConcreteStateB());
task.request(); // Output: ConcreteStateB is handling.
