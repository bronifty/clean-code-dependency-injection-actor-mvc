interface IObservableValue<T> {
  accessor(newValue?: T, ...args: any[]): T | undefined;
  publish(): void;
  subscribe(
    handler: (current: T, previous: T) => void,
    immediate?: boolean
  ): void;
  unsubscribe(handler: (current: T, previous: T) => void): void;
  compute(): Promise<void> | void;
}
class ObservableValue<T> implements IObservableValue<T> {
  private previousValue: T | null = null;
  private value: T | null = null;
  private valueFunction?: (...args: any[]) => T | Promise<T>;
  private valueFunctionArgs: any[] = [];
  private subscribers: Array<(current: T, previous: T) => void> = [];
  private static _computeActive = false;
  private static _computeChildren: IObservableValue<any>[] = [];
  accessor(newValue?: T, ...args: any[]): T | undefined {
    if (newValue === undefined) {
      if (
        ObservableValue._computeActive &&
        ObservableValue._computeChildren.indexOf(this) === -1
      ) {
        ObservableValue._computeChildren.push(this);
      }
      return this.value;
    } else if (newValue !== this.value) {
      if (typeof newValue !== "function") {
        this.previousValue = this.value;
        this.value = newValue;
        this.publish();
      } else {
        this.valueFunction = newValue;
        this.valueFunctionArgs = args;
        ObservableValue._computeActive = true;
        this.compute();
        ObservableValue._computeActive = false;
        ObservableValue._computeChildren.forEach((child) => {
          child.subscribe(() => this.compute());
        });
        ObservableValue._computeChildren.length = 0;
      }
    }
  }
  publish() {
    this.subscribers.slice().forEach((handler) => {
      if (!handler) return;
      handler.call(this, this.value!, this.previousValue!);
    });
  }
  subscribe(handler: (current: T, previous: T) => void, immediate?: boolean) {
    this.subscribers.push(handler);
    if (immediate) {
      handler.call(this, this.value!, this.previousValue!);
    }
  }
  unsubscribe(handler: (current: T, previous: T) => void) {
    const index = this.subscribers.indexOf(handler);
    this.subscribers.splice(index, 1);
  }
  async compute() {
    if (!this.valueFunction) return;
    const result = this.valueFunction.apply(this, this.valueFunctionArgs);
    if (result instanceof Promise) {
      this.accessor(await result);
    } else {
      this.accessor(result);
    }
  }
}
class ObservableFactory {
  static createObservableValue<T>(...args: any[]): IObservableValue<T> {
    const observable = new ObservableValue<T>();
    observable.accessor(...args);
    return observable;
  }
}
const factory = ObservableFactory;
const obsValue = factory.createObservableValue<string>("initial");
obsValue.subscribe((current, previous) =>
  console.log("Changed from", previous, "to", current)
);
obsValue.accessor("new");
// class ObservableValueFactory {
//   static createObservableValue<T>(...args: any[]): IObservableValue<T> {
//     const observable = new ObservableValue<T>();
//     function prop(...args: any[]): T | undefined {
//       return observable.accessor.apply(observable, args);
//     }
//     // Copy methods from the observable to the prop function
//     prop.subscribe = observable.subscribe.bind(observable);
//     prop.unsubscribe = observable.unsubscribe.bind(observable);
//     prop.publish = observable.publish.bind(observable);
//     prop.compute = observable.compute.bind(observable);
//     // Attach the accessor method as a callable method
//     Object.defineProperty(prop, "accessor", {
//       value: observable.accessor.bind(observable),
//       writable: false,
//     });
//     // Initialize the observable with the provided arguments
//     prop(...args);
//     return prop as unknown as IObservableValue<T>;
//   }
// }
//
// async function main() {
//   const factory = ObservableValueFactory;
//   // Creating an observable value and subscribing to changes
//   const obsValue = factory.createObservableValue<string>("initial");
//   obsValue.subscribe((current, previous) =>
//     console.log("Changed from", previous, "to", current)
//   );
//   // Writing to the observable value
//   obsValue.accessor("new"); // Outputs: "Changed from initial to new"
//   // Reading from the observable value
//   console.log("Current value:", obsValue.accessor()); // Outputs: "Current value: new"

//   // Creating a computed observable value that takes multiple arguments
//   const computedValue = factory.createObservableValue<number>(
//     (a: number, b: number, c: number) => a + b + c,
//     1,
//     2,
//     3
//   );
//   computedValue.subscribe((current) => console.log("Computed value:", current));

//   // Writing multiple arguments to the computed observable value
//   computedValue.accessor(
//     (a: number, b: number, c: number) => a * b * c,
//     2,
//     3,
//     4
//   ); // Outputs: "Computed value: 24"

//   // Reading the computed value
//   console.log("Computed value:", computedValue.accessor()); // Outputs: "Computed value: 24"
// }

// main();
