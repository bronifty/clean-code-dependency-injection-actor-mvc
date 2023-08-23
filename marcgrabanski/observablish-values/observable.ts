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

  accessor(newValue?: T | ((...args: any[]) => T), ...args: any[]): T | null {
    if (typeof newValue === "function") {
      this.valueFunction = newValue;
      this.valueFunctionArgs = args;
      this.compute();
    } else if (newValue !== undefined && newValue !== this.value) {
      this.previousValue = this.value;
      this.value = newValue;
      this.publish();
    }
    return this.value;
  }

  async compute() {
    if (!this.valueFunction) return;
    if (
      ObservableValue._computeActive &&
      ObservableValue._computeChildren.indexOf(this) === -1
    ) {
      ObservableValue._computeChildren.push(this);
      return;
    }

    // Set the _computeActive flag to true to indicate that we are in the middle of a computation
    ObservableValue._computeActive = true;

    // Evaluate the computed value
    const result = this.valueFunction.apply(
      this,
      this.valueFunctionArgs.map((arg) =>
        arg instanceof ObservableValue ? arg.accessor() : arg
      )
    );
    if (result instanceof Promise) {
      this.accessor(await result);
    } else {
      this.accessor(result);
    }

    // Set the _computeActive flag to false to indicate that we are done with the computation
    ObservableValue._computeActive = false;

    // Recursively re-evaluate any other computed observables that depend on this one
    ObservableValue._computeChildren.forEach((child) => {
      if (child instanceof ObservableValue) {
        child.compute();
      }
    });
    ObservableValue._computeChildren.length = 0;
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
  const obsValue2 = factory.createObservableValue<number>(5);
  const sumValue = factory.createObservableValue<number>();

  sumValue.subscribe((current, previous) =>
    console.log(`sumValue current: ${current}; previous: ${previous}`)
  );
  // Function to compute sumValue based on obsValue1 and obsValue2
  const computeSum = () => {
    const sum = (obsValue1.accessor() ?? 0) + (obsValue2.accessor() ?? 0);
    sumValue.accessor(sum);
  };

  // Initial computation
  computeSum(); // should return 10+5 (actually 11+5 because of the extra accessor above)

  // Set up subscriptions to recompute sumValue when obsValue1 or obsValue2 changes
  obsValue1.subscribe(() => computeSum());
  obsValue2.subscribe(() => computeSum());

  // Changing obsValue1 and obsValue2 will trigger a re-computation of sumValue
  obsValue1.accessor(20); // Outputs: "Sum value: 25"
  obsValue2.accessor(10); // Outputs: "Sum value: 30"

  // obsValue1.subscribe((current, previous) =>
  //   console.log(`obsValue1 current: ${current}; previous: ${previous}`)
  // );

  // console.log(`obsValue1.accessor(): ${obsValue1.accessor()}`);
  // console.log("calling obsValue1.accessor(11)");
  // obsValue1.accessor(11); // obsValue1 current: 11; previous: 10
}

main();
