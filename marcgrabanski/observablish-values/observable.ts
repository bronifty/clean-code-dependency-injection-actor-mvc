export interface IObservableValue<T> {
  accessor(newValue?: T, ...args: any[]): T | null;
  publish(): void;
  subscribe(
    handler: (current: T, previous: T) => void,
    immediate?: boolean
  ): void;
  unsubscribe(handler: (current: T, previous: T) => void): void;
  compute(): Promise<void> | void;
}
export class ObservableValue<T> implements IObservableValue<T> {
  private previousValue: T | null = null;
  private value: T | null = null;
  private valueFunction?: (...args: any[]) => T | Promise<T>;
  private valueFunctionArgs: any[] = [];
  private subscribers: Array<(current: T, previous: T) => void> = [];
  private static _computeActive = false;
  private static _computeChildren: IObservableValue<any>[] = [];
  accessor(newValue?: T, ...args: any[]): T | null {
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
        this.valueFunction = newValue as (...args: any[]) => T | Promise<T>;
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
    return null;
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
export class ObservableFactory {
  static createObservableValue<T>(...args: any[]): IObservableValue<T> {
    const observable = new ObservableValue<T>();
    observable.accessor(...args);
    return observable;
  }
}

async function main() {
  const factory = ObservableFactory;
  const obsValue1 = factory.createObservableValue<number>(10);
  const computeObsValue2 = (value: number) => value * 2;
  const obsValue2 = factory.createObservableValue<number>(
    computeObsValue2(obsValue1.accessor()!)
  );
  obsValue2.subscribe((current) =>
    console.log("obsValue2 sub 1 triggered on value update: ", current)
  ); // subscription only updates with the callback on write access (to notify all subscribers of the update; internally it will call publish once the new value is set)
  obsValue2.subscribe((value) =>
    console.log("obsValue2 sub 2 triggered on value update: ", value)
  );
  obsValue2.publish(); // calling publish directly will access the current values by running all subscription methods
  obsValue2.accessor(1);
  obsValue1.subscribe((currentValue) => {
    // update of obsValue1 triggers update of obsValue2 subsription callback, which, in turn, triggers obsValue2's console log subscription callbacks
    const newValue = computeObsValue2(currentValue);
    obsValue2.accessor(newValue);
  });
  // Changing obsValue1 will trigger a re-computation of obsValue2
  obsValue1.accessor(20); // Outputs: "Computed value: 40"
}
main();

// async function main() {
//   const factory = ObservableFactory;
//   const obsValue1 = factory.createObservableValue<number>(10);
//   const obsValue2 = factory.createObservableValue<number>(
//     (value: number) => value * 2
//   );
//   obsValue2.subscribe((current) => console.log("Computed value:", current));
//   obsValue2.accessor();
//   obsValue1.subscribe((currentValue) => {
//     const newValue = currentValue * 2; // Compute the new value based on obsValue1
//     obsValue2.accessor(newValue); // Update obsValue2 with the computed value
//   });
//   // Changing obsValue1 will trigger a re-computation of obsValue2
//   obsValue1.accessor(20); // Outputs: "Computed value: 40"
// }
// main();
