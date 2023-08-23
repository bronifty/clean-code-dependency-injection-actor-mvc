interface IObservable<T> {
  value(): T;
  subscribe(handler: (current: T, previous: T) => void): void;
  set(newValue: T): void;
}

class Observable<T> implements IObservable<T> {
  private _value: T;
  private previousValue: T | null = null;
  private subscribers: Array<(current: T, previous: T) => void> = [];

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  value(): T {
    return this._value;
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
      this.publish();
    }
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

function main() {
  const obsArray = ObservableFactory.createObservable<number[]>([1, 2, 3]);
  obsArray.subscribe((current, previous) => {
    console.log("obsArray changed from", previous, "to", current);
  });

  console.log("\nPushing 4 to obsArray (silent update):");
  obsArray.push(4); // logs: obsArray changed from [1, 2, 3] to [1, 2, 3, 4]

  console.log("\nSetting new value to obsArray:");
  obsArray.set([4, 5]); // logs: obsArray changed from [1, 2, 3, 4] to [4, 5]
}

main();

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

// function main() {
//   const logChanges = (name: string, current: number) => {
//     console.log(`${name} changed to ${current}`);
//   };
//   const a = ObservableFactory.createObservable(1);
//   const b = ObservableFactory.createObservable(2);

//   a.subscribe(() => logChanges("a", a.value()));
//   b.subscribe(() => logChanges("b", b.value()));

//   const computedSum = ObservableFactory.createComputedObservable(
//     () => a.value() + b.value(),
//     [a, b]
//   );

//   computedSum.subscribe(() => logChanges("computedSum", computedSum.value()));

//   console.log("Initial values:");
//   console.log("a:", a.value());
//   console.log("b:", b.value());
//   console.log("computedSum:", computedSum.value());

//   console.log("\nUpdating a to 5:");
//   a.set(5);

//   console.log("\nUpdating b to 3:");
//   b.set(3);
// }

// main();
