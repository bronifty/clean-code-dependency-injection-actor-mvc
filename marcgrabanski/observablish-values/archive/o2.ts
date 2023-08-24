interface IObservable<T> {
  value: T;
  subscribe(handler: () => void): void;
  publish(handler: () => void): void;
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

  publish() {
    this.subscribers.forEach((handler) => handler());
  }
}

class ComputedObservable<T> implements IObservable<T> {
  private _value: T;
  private computeFunction: () => T | Promise<T>;
  private subscribers: Array<() => void> = [];
  private dependencies: Set<IObservable<any>> = new Set();

  constructor(computeFunction: () => T | Promise<T>) {
    this.computeFunction = computeFunction;
    this.recalculate();
  }

  get value(): T {
    return this._value;
  }

  subscribe(handler: () => void): void {
    this.subscribers.push(handler);
  }

  private async recalculate() {
    const proxyHandler: ProxyHandler<IObservable<any>> = {
      get: (target, property) => {
        if (property === "value") this.dependencies.add(target);
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

    this.dependencies.forEach((obs) => obs.subscribe(() => this.recalculate()));
    this.publish();
  }

  publish() {
    this.subscribers.forEach((handler) => handler());
  }
}

// // Usage
// const a = new Observable(1);
// const b = new ComputedObservable(() => a.value + 1);
// b.subscribe(() => console.log(`New value: ${b.value}`));
// a.value = 3; // Logs: New value: 4

async function main() {
  const logCurrPrev = (current: any, previous: any) => {
    console.log(`current value: ${current}\n previous value: ${previous}`);
  };
  const obsValue = new Observable("initial");
  obsValue.subscribe(logCurrPrev);
  console.log(`obsValue.value: ${obsValue.value}`);
  obsValue.value = "new"; // triggers publish which runs subscriptions
  // obsValue.value = "yes hello this is dog"; // silent update
  // obsValue.publish();
}
main();

// const a = new Observable(1);
// const b = new Observable(2);
// const computed =  new ComputedObservable(()=> a.value + b.value)
// a.subscribe(()=> computed.recalculate())
// b.subscribe(()=> computed.recalculate())

// the a and b subscribe methods should be called as part of the initialization logic of the Computed Observable (in the constructor); the constructor should make a call to subscribe with each observable after it checks the type of argument passed in (eg it could loop over arguments array from function and check if type IObservable or if it implements that interface);

// then create a recalculate method that fires the function passed into ComputedObservable (()=> a.value + b.value);

// the value returned from the function should go into the value field of the ComputedObservable; the actual function used to compute the value (the function used to initialize the ComputedObservable) should be saved as computeFunction
