interface IObservable<T> {
  value(): T;
  subscribe(handler: () => void): void;
  set(newValue: T): void;
}

class Observable<T> implements IObservable<T> {
  private _value: T;
  private subscribers: Array<() => void> = [];

  constructor(initialValue: T) {
    this._value = initialValue;
  }
  publish() {
    this.subscribers.forEach((handler) =>
      handler(this.value, this.previousValue)
    );
  }
  push(item: T) {
    if (Array.isArray(this.value)) {
      this.value.push(item);
    }
  }

  value(): T {
    return this._value;
  }

  subscribe(handler: () => void): void {
    this.subscribers.push(handler);
  }

  set(newValue: T): void {
    this._value = newValue;
    this.subscribers.forEach((handler) => handler());
  }
}

class ObservableFactory {
  static createObservable<T>(initialValue: T): IObservable<T> {
    return new Observable<T>(initialValue);
  }

  static createComputedObservable<T>(
    computeFunction: () => T,
    dependencies: IObservable<any>[]
  ): IObservable<T> {
    const computedValue = new Observable<T>(computeFunction());
    dependencies.forEach((dep) => {
      dep.subscribe(() => {
        computedValue.set(computeFunction());
      });
    });
    return computedValue;
  }
}

// // Usage
// const logChanges = (current: number, previous: number) => {
//   console.log(`Changed to ${current} from ${previous}`);
// };

// const a = ObservableFactory.createObservable(1);
// const b = ObservableFactory.createObservable(2);
// const computed = ObservableFactory.createComputedObservable(
//   () => a.value() + b.value(),
//   [a, b]
// );

// let previousValue = computed.value();
// computed.subscribe(() => {
//   const currentValue = computed.value();
//   logChanges(currentValue, previousValue);
//   previousValue = currentValue;
// });

// console.log(`computed.value: ${computed.value()}`); // 3
// a.set(2); // logChanges(4,3)
// a.set(4); // logChanges(6,4)
// b.set(5); // logChanges(9,6)

function main() {
  const logChanges = (name: string, current: number) => {
    console.log(`${name} changed to ${current}`);
  };
  const a = ObservableFactory.createObservable(1);
  const b = ObservableFactory.createObservable(2);

  a.subscribe(() => logChanges("a", a.value()));
  b.subscribe(() => logChanges("b", b.value()));

  const computedSum = ObservableFactory.createComputedObservable(
    () => a.value() + b.value(),
    [a, b]
  );

  computedSum.subscribe(() => logChanges("computedSum", computedSum.value()));

  console.log("Initial values:");
  console.log("a:", a.value());
  console.log("b:", b.value());
  console.log("computedSum:", computedSum.value());

  console.log("\nUpdating a to 5:");
  a.set(5);

  console.log("\nUpdating b to 3:");
  b.set(3);
}

main();
