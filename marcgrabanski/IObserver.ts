interface IObserver {
  update(data: string): void;
}
class Observer implements IObserver {
  update(data: string) {
    console.log(data);
  }
}
class Subject {
  private observers: IObserver[] = [];
  addObserver(observer: IObserver) {
    this.observers.push(observer);
  }
  removeObserver(observer: IObserver) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  notify(data: string) {
    this.observers.forEach(observer => observer.update(data));
  }
}
const subject = new Subject();
const observer = new Observer();
const observer2 = new Observer();
subject.addObserver(observer);
subject.addObserver(observer2);
subject.notify('Everyone gets pizzas!');
