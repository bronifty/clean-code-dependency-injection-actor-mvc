interface IObservable<T> {
  value: T;
  subscribe(handler: () => void): void;
}

class Observable<T> implements IObservable<T> {
  private _value: T;
  private subscribers: Array<() => void> = [];

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this.publish();
  }

  subscribe(handler: () => void): void {
    this.subscribers.push(handler);
  }

  private publish() {
    this.subscribers.forEach((handler) => handler());
  }
}

class ComputedObservable<T> implements IObservable<T> {
  private _value: T;
  private computeFunction: () => T;
  private subscribers: Array<() => void> = [];

  constructor(computeFunction: () => T) {
    this.computeFunction = computeFunction;
    this.recalculate();

    const funcBody = computeFunction.toString();
    const variableNames = funcBody.match(/([a-zA-Z_]\w*)\.value/g);

    if (variableNames) {
      variableNames.forEach((variable) => {
        const observableName = variable.split(".")[0];
        const observable = eval(observableName);
        if (observable instanceof Observable) {
          observable.subscribe(() => this.recalculate());
        }
      });
    }
  }

  get value(): T {
    return this._value;
  }

  subscribe(handler: () => void): void {
    this.subscribers.push(handler);
  }

  recalculate() {
    this._value = this.computeFunction();
    this.publish();
  }

  private publish() {
    this.subscribers.forEach((handler) => handler());
  }
}

// Usage
const a = new Observable(1);
const b = new Observable(2);
const computed = new ComputedObservable(() => a.value + b.value);
computed.subscribe(() => console.log(`Computed value: ${computed.value}`));
a.value = 3; // Logs: Computed value: 5
b.value = 3; // Logs: Computed value: 6

// The essence of the story (10 pts btw i'm saying this is a hard story gimme the pts) is extract the child observables from the parent compute function passed into the constructor and call their subscribe methods individually, passing in the parent's recalculate method

// child.subscribe(()=>parent.recalculate())
