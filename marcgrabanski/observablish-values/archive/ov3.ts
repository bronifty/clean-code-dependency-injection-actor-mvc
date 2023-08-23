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

async function main() {
  const factory = ObservableFactory;

  // Creating two observable values
  const obsValue1 = factory.createObservableValue<number>(10);
  const obsValue2 = factory.createObservableValue<number>(
    (value: number) => value * 2,
    obsValue1.accessor() // Accessing obsValue1 here triggers _computeActive logic
  );

  // Subscribing to changes in obsValue2
  obsValue2.subscribe((current) => console.log("Computed value:", current));

  // Changing obsValue1 will trigger a re-computation of obsValue2
  obsValue1.accessor(20); // Outputs: "Computed value: 40"
  obsValue2.accessor();
}

main();

// async function main() {
//   const factory = ObservableFactory;
//   const obsValue = factory.createObservableValue<string>("initial");
//   const handler = (current: string, previous: string) =>
//     console.log("Changed from", previous, "to", current);
//   obsValue.subscribe(handler); // Registers a callback to fire when the value changes, typically through the accessor method (set).
//   obsValue.accessor("new"); // Outputs: "Changed from initial to new"

//   // Manually update the internal state without calling publish
//   (obsValue as any).value = "manuallyChanged"; // This is a hack to access private members for demonstration purposes

//   // Manually publishing changes to notify the subscriber
//   obsValue.publish(); // Outputs: "Changed from new to manuallyChanged"
// }

// main();

// async function main() {
//   const factory = ObservableFactory;

//   // Creating an observable value and subscribing to changes
//   const obsValue = factory.createObservableValue<string>("initial");
//   const handler = (current: string, previous: string) =>
//     console.log("Changed from", previous, "to", current);
//   obsValue.subscribe(handler);

//   // Writing to the observable value
//   obsValue.accessor("new"); // Outputs: "Changed from initial to new"

//   // Reading from the observable value
//   console.log("Current value:", obsValue.accessor()); // Outputs: "Current value: new"

//   // Unsubscribe the handler
//   obsValue.unsubscribe(handler);

//   // Creating a computed observable value
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

//   // Manually publishing changes (this will have no effect since no handler is subscribed)
//   obsValue.publish();
// }

// main();

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
