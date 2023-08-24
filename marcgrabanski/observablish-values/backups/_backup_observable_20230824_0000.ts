interface IObservable<T> {
  value: T; // value is a property with an implicit getter and setter
  subscribe(handler: (current: T, previous: T) => void): void;
  set(newValue: T): void;
  publish(): void;
  push(item: T extends Array<infer U> ? U : never): void;
}

class Observable<T> implements IObservable<T> {
  private _value: T;
  private previousValue: T | null = null;
  private subscribers: Array<(current: T, previous: T) => void> = [];

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
  }

  subscribe(handler: (current: T, previous: T) => void): void {
    this.subscribers.push(handler);
  }

  set(newValue: T): void {
    this.previousValue = this._value;
    this._value = newValue;
    this.publish();
  }

  publish() {
    this.subscribers.forEach((handler) =>
      handler(this._value, this.previousValue!)
    );
  }

  push(item: any) {
    if (Array.isArray(this._value)) {
      this.previousValue = [...this._value];
      (this._value as any[]).push(item);
      // this.publish();
    }
  }
}

class ComputedObservable<T> implements IObservable<T> {
  private _value: T;
  private previousValue: T | null = null;
  private subscribers: Array<(current: T, previous: T) => void> = [];

  constructor(computeFunction: () => T, dependencies: IObservable<any>[]) {
    this._value = computeFunction();
    dependencies.forEach((dep) => {
      dep.subscribe(() => {
        this.set(computeFunction());
      });
    });
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
  }

  subscribe(handler: (current: T, previous: T) => void): void {
    this.subscribers.push(handler);
  }

  set(newValue: T): void {
    this.previousValue = this._value;
    this._value = newValue;
    this.publish();
  }

  publish() {
    this.subscribers.forEach((handler) =>
      handler(this._value, this.previousValue!)
    );
  }

  push(item: any) {
    if (Array.isArray(this._value)) {
      this.previousValue = [...this._value];
      (this._value as any[]).push(item);
    }
  }
}

class ObservableFactory {
  static createObservable<T>(
    initialValueOrFunction: T | (() => T),
    dependencies?: IObservable<any>[]
  ): IObservable<T> {
    if (typeof initialValueOrFunction === "function" && dependencies) {
      return new ComputedObservable<T>(
        initialValueOrFunction as () => T,
        dependencies
      );
    }
    return new Observable<T>(initialValueOrFunction as T);
  }
}

// class ObservableFactory {
//   static createObservable<T>(initialValue: T): IObservable<T> {
//     return new Observable<T>(initialValue);
//   }

//   // refactor to create a strategy and implement a concrete class for ComputedObservable
//   static createComputedObservable<T>(
//     computeFunction: () => T,
//     dependencies: IObservable<any>[]
//   ): IObservable<T> {
//     const computedValue = new Observable<T>(computeFunction());
//     dependencies.forEach((dep) => {
//       dep.subscribe(() => {
//         computedValue.set(computeFunction());
//       });
//     });
//     return computedValue;
//   }
// }

function main() {
  const logCurrPrev = (current: any, previous: any) => {
    console.log(`current value: ${current}\n previous value: ${previous}`);
  };

  // Creating observable values
  const obsValue = ObservableFactory.createObservable("initial");
  obsValue.subscribe(logCurrPrev);
  console.log(`obsValue.value: ${obsValue.value}`);
  obsValue.set("new"); // triggers publish which runs subscriptions
  obsValue.value = "yes hello this is dog"; // silent update
  obsValue.publish();

  // Working with arrays
  const obsArray = ObservableFactory.createObservable([1, 2, 3]);
  obsArray.subscribe(logCurrPrev);
  console.log(`obsArray.value ${obsArray.value}`);
  obsArray.push(4); // silent update
  obsArray.publish(); // changed to 1,2,3,4 from 1,2,3
  obsArray.set([4, 5]); // changed to 4,5 from 1,2,3,4

  // Working with computed observables
  const a = ObservableFactory.createObservable(1);
  const b = ObservableFactory.createObservable(2);
  const computed = ObservableFactory.createObservable(
    () => a.value + b.value,
    [a, b]
  );
  computed.subscribe(logCurrPrev);
  console.log(`computed.value ${computed.value}`); // computed.value 3
  a.set(2); // current value 4 previous value 3
}

main();
