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

  protected publish() {
    this.subscribers.forEach((handler) => handler());
  }
}

class ComputedObservable<T> implements IObservable<T> {
  private _value: T;
  private computeFunction: () => T | Promise<T>;
  private subscribers: Array<() => void> = [];
  private childObservables: IObservable<any>[] = [];

  constructor(computeFunction: () => T | Promise<T>) {
    this.computeFunction = computeFunction;
    this.recalculate();
  }

  private async recalculate() {
    // Extract dependencies by tracking accessed observables
    const accessedObservables: Set<IObservable<any>> = new Set();
    const proxyHandler: ProxyHandler<any> = {
      get: (target, property) => {
        if (property === "value") accessedObservables.add(target);
        return target[property];
      },
    };

    const proxyComputeFunction = () => {
      return this.computeFunction.apply(new Proxy(this, proxyHandler));
    };

    const result = proxyComputeFunction();
    if (result instanceof Promise) {
      this._value = await result;
    } else {
      this._value = result;
    }

    // Subscribe to dependencies
    this.childObservables.forEach((obs) => obs.subscribe(() => {}));
    this.childObservables = Array.from(accessedObservables);
    this.childObservables.forEach((obs) =>
      obs.subscribe(() => this.recalculate())
    );
    this.publish();
  }

  get value(): T {
    return this._value;
  }

  subscribe(handler: () => void): void {
    this.subscribers.push(handler);
  }

  private publish() {
    this.subscribers.forEach((handler) => handler());
  }
}

// Usage
const a = new Observable(1);
const b = new ComputedObservable(async () => a.value + 1);
b.subscribe(() => console.log(`New value: ${b.value}`));
a.value = 3; // Logs: New value: 4
a.value = 4;
