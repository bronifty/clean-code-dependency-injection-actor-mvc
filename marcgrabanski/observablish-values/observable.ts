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
  accessor(
    newValue?: T | ((...args: any[]) => T | Promise<T>),
    ...args: any[]
  ): T | null {
    if (typeof newValue === "function") {
      this.valueFunction = newValue as (...args: any[]) => T | Promise<T>;
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
  const productValue = factory.createObservableValue<number>();
  const combinedValue = factory.createObservableValue<number>();

  const computeSum = () => {
    const sum = (obsValue1.accessor() ?? 0) + (obsValue2.accessor() ?? 0);
    sumValue.accessor(sum);
  };
  const computeProduct = () => {
    const product = (obsValue1.accessor() ?? 0) * (obsValue2.accessor() ?? 0);
    productValue.accessor(product);
  };
  const computeCombined = () => {
    const combined =
      (sumValue.accessor() ?? 0) + (productValue.accessor() ?? 0);
    combinedValue.accessor(combined);
  };
  function logObservable(name: string, current: any, previous: any) {
    console.log(`${name} current: ${current}; previous: ${previous}`);
  }

  sumValue.subscribe(() => computeCombined());
  productValue.subscribe(() => computeCombined());
  sumValue.subscribe((current, previous) =>
    logObservable("sumValue", current, previous)
  );
  productValue.subscribe((current, previous) =>
    logObservable("productValue", current, previous)
  );
  combinedValue.subscribe((current, previous) =>
    logObservable("combinedValue", current, previous)
  );
  obsValue1.subscribe(() => {
    computeSum();
    computeProduct();
  });
  obsValue2.subscribe(() => {
    computeSum();
    computeProduct();
  });

  console.log("calling computeSum");
  computeSum(); // sumValue current: 15; previous: null
  console.log("calling computeProduct");
  computeProduct(); // productValue current: 50; previous: null
  console.log(
    "calling computeCombined (no change passed to the combinedValue accessor method, thus no log subscription callback will be triggered)"
  );
  computeCombined(); // combinedValue current: 65; previous: null

  console.log("calling obsValue1.accessor(20)");
  obsValue1.accessor(20); // Outputs updated values
  console.log("calling obsValue2.accessor(10)");
  obsValue2.accessor(10); // Outputs updated values
}
main();
