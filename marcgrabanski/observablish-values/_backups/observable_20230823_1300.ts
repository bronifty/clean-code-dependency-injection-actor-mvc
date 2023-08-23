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
  private static _computeChildren: ObservableValue<any>[] = [];

  accessor(
    newValue?: T | ((...args: any[]) => T | Promise<T>),
    ...args: any[]
  ): T | null {
    if (typeof newValue === "function") {
      this.valueFunction = newValue as (...args: any[]) => T | Promise<T>;
      this.valueFunctionArgs = args;

      // Subscribe to child observables
      ObservableValue._computeActive = true;
      this.compute();
      ObservableValue._computeActive = false;
      ObservableValue._computeChildren.forEach((child) => {
        child.subscribe(() => this.compute());
      });
      ObservableValue._computeChildren.length = 0;
    } else if (newValue !== undefined && newValue !== this.value) {
      this.previousValue = this.value;
      this.value = newValue;
      this.publish();
    }
    return this.value;
  }

  async compute() {
    if (!this.valueFunction) return;

    const result = this.valueFunction.apply(
      this,
      this.valueFunctionArgs.map((arg) => {
        if (arg instanceof ObservableValue) {
          if (
            ObservableValue._computeActive &&
            ObservableValue._computeChildren.indexOf(arg) === -1
          ) {
            ObservableValue._computeChildren.push(arg);
          }
          return arg.accessor();
        }
        return arg;
      })
    );

    if (result instanceof Promise) {
      this.accessor(await result);
    } else {
      this.accessor(result);
    }
  }
  // accessor(
  //   newValue?: T | ((...args: any[]) => T | Promise<T>),
  //   ...args: any[]
  // ): T | null {
  //   console.log("Accessor called:", newValue, args); // Log here
  //   if (typeof newValue === "function") {
  //     this.valueFunction = newValue as (...args: any[]) => T | Promise<T>;
  //     this.valueFunctionArgs = args;
  //     ObservableValue._computeActive = true;
  //     this.compute();
  //     ObservableValue._computeActive = false;
  //     ObservableValue._computeChildren.forEach((child) => {
  //       child.subscribe(() => this.compute());
  //     });
  //     ObservableValue._computeChildren.length = 0;
  //   } else if (newValue !== undefined && newValue !== this.value) {
  //     this.previousValue = this.value;
  //     this.value = newValue;
  //     this.publish();
  //   }
  //   return this.value;
  // }

  // async compute() {
  //   console.log("Compute called"); // Log here
  //   if (!this.valueFunction) return;

  //   const result = this.valueFunction.apply(
  //     this,
  //     this.valueFunctionArgs.map((arg) => {
  //       if (arg instanceof ObservableValue) {
  //         if (
  //           ObservableValue._computeActive &&
  //           ObservableValue._computeChildren.indexOf(arg) === -1
  //         ) {
  //           ObservableValue._computeChildren.push(arg);
  //         }
  //         return arg.accessor();
  //       }
  //       return arg;
  //     })
  //   );

  //   if (result instanceof Promise) {
  //     this.accessor(await result);
  //   } else {
  //     this.accessor(result);
  //   }
  // }

  publish() {
    console.log("Publish called:", this.value, this.previousValue); // Log here
    this.subscribers.slice().forEach((handler) => {
      if (!handler) return;
      handler.call(this, this.value!, this.previousValue!);
    });
  }

  subscribe(handler: (current: T, previous: T) => void, immediate?: boolean) {
    console.log("Subscribe called:", handler); // Log here
    this.subscribers.push(handler);
    if (immediate) {
      handler.call(this, this.value!, this.previousValue!);
    }
  }

  unsubscribe(handler: (current: T, previous: T) => void) {
    console.log("Unsubscribe called:", handler); // Log here
    const index = this.subscribers.indexOf(handler);
    this.subscribers.splice(index, 1);
  }
}

// export class ObservableValue<T> implements IObservableValue<T> {
//   private previousValue: T | null = null;
//   private value: T | null = null;
//   private valueFunction?: (...args: any[]) => T | Promise<T>;
//   private valueFunctionArgs: any[] = [];
//   private subscribers: Array<(current: T, previous: T) => void> = [];
//   private static _computeActive = false;
//   private static _computeChildren: IObservableValue<any>[] = [];
//   private static _computeStack: ObservableValue<any>[] = [];
//   accessor(
//     newValue?: T | ((...args: any[]) => T | Promise<T>),
//     ...args: any[]
//   ): T | null {
//     if (typeof newValue === "function") {
//       this.valueFunction = newValue as (...args: any[]) => T | Promise<T>;
//       this.valueFunctionArgs = args;
//       this.compute();
//     } else if (newValue !== undefined && newValue !== this.value) {
//       this.previousValue = this.value;
//       this.value = newValue;
//       this.publish();
//     }
//     return this.value;
//   }

//   async compute() {
//     if (!this.valueFunction) return;

//     // Evaluate the computed value
//     const result = this.valueFunction.apply(
//       this,
//       this.valueFunctionArgs.map((arg) => {
//         if (arg instanceof ObservableValue) {
//           // If this is a child observable, create a subscription to it
//           arg.subscribe(() => this.compute());

//           return arg.accessor();
//         }
//         return arg;
//       })
//     );

//     if (result instanceof Promise) {
//       this.accessor(await result);
//     } else {
//       this.accessor(result);
//     }
//   }

//   // async compute() {
//   //   console.log("Computing:", this); // Log the current observable
//   //   if (!this.valueFunction) return;

//   //   // Push this observable onto the compute stack
//   //   ObservableValue._computeStack.push(this);

//   //   // Evaluate the computed value
//   //   const result = this.valueFunction.apply(
//   //     this,
//   //     this.valueFunctionArgs.map((arg) => {
//   //       if (arg instanceof ObservableValue) {
//   //         // If there's a parent computation, subscribe it to this observable
//   //         const parent =
//   //           ObservableValue._computeStack[
//   //             ObservableValue._computeStack.length - 2
//   //           ];
//   //         if (parent) {
//   //           console.log("Subscribing parent to child:", parent, arg); // Log subscription
//   //           arg.subscribe(() => parent.compute());
//   //         }
//   //         return arg.accessor();
//   //       }
//   //       return arg;
//   //     })
//   //   );

//   //   if (result instanceof Promise) {
//   //     this.accessor(await result);
//   //   } else {
//   //     this.accessor(result);
//   //   }

//   //   // Pop this observable off the compute stack
//   //   ObservableValue._computeStack.pop();
//   // }

//   // async compute() {
//   //   if (!this.valueFunction) return;

//   //   // Push this observable onto the compute stack
//   //   ObservableValue._computeStack.push(this);

//   //   // Evaluate the computed value
//   //   const result = this.valueFunction.apply(
//   //     this,
//   //     this.valueFunctionArgs.map((arg) => {
//   //       if (arg instanceof ObservableValue) {
//   //         // If there's a parent computation, subscribe it to this observable
//   //         const parent =
//   //           ObservableValue._computeStack[
//   //             ObservableValue._computeStack.length - 2
//   //           ];
//   //         if (parent) {
//   //           arg.subscribe(() => parent.compute());
//   //         }
//   //         return arg.accessor();
//   //       }
//   //       return arg;
//   //     })
//   //   );

//   //   if (result instanceof Promise) {
//   //     this.accessor(await result);
//   //   } else {
//   //     this.accessor(result);
//   //   }

//   //   // Pop this observable off the compute stack
//   //   ObservableValue._computeStack.pop();
//   // }

//   // async compute() {
//   //   if (!this.valueFunction) return;
//   //   if (
//   //     ObservableValue._computeActive &&
//   //     ObservableValue._computeChildren.indexOf(this) === -1
//   //   ) {
//   //     ObservableValue._computeChildren.push(this);
//   //     return;
//   //   }

//   //   // Set the _computeActive flag to true to indicate that we are in the middle of a computation
//   //   ObservableValue._computeActive = true;

//   //   // Clear children observables from the previous computation
//   //   ObservableValue._computeChildren.length = 0;

//   //   // Evaluate the computed value
//   //   const result = this.valueFunction.apply(
//   //     this,
//   //     this.valueFunctionArgs.map((arg) => {
//   //       if (arg instanceof ObservableValue) {
//   //         // Subscribe to child observable
//   //         arg.subscribe(() => this.compute());
//   //         return arg.accessor();
//   //       }
//   //       return arg;
//   //     })
//   //   );
//   //   if (result instanceof Promise) {
//   //     this.accessor(await result);
//   //   } else {
//   //     this.accessor(result);
//   //   }

//   //   // Set the _computeActive flag to false to indicate that we are done with the computation
//   //   ObservableValue._computeActive = false;
//   // }

//   publish() {
//     this.subscribers.slice().forEach((handler) => {
//       if (!handler) return;
//       handler.call(this, this.value!, this.previousValue!);
//     });
//   }
//   subscribe(handler: (current: T, previous: T) => void, immediate?: boolean) {
//     this.subscribers.push(handler);
//     if (immediate) {
//       handler.call(this, this.value!, this.previousValue!);
//     }
//   }
//   unsubscribe(handler: (current: T, previous: T) => void) {
//     const index = this.subscribers.indexOf(handler);
//     this.subscribers.splice(index, 1);
//   }
// }
export class ObservableFactory {
  static createObservableValue<T>(...args: any[]): IObservableValue<T> {
    const observable = new ObservableValue<T>();
    observable.accessor(...args);
    return observable;
  }
}

async function main() {
  const factory = ObservableFactory;
  const a = factory.createObservableValue<number>(1);
  const b = factory.createObservableValue<number>(2);
  console.log("Initial values:", a.accessor(), b.accessor()); // Log here

  const computedFunction = (arg: number) => a.accessor()! + b.accessor()! + arg;
  const computed = factory.createObservableValue<number>(computedFunction, 3);

  computed.subscribe((current, previous) => {
    console.log(`Computed value changed: ${previous} -> ${current}`);
  });

  console.log("Computing initial value");
  computed.compute();

  console.log("Updating a to 5");
  a.accessor(5); // Log here
  console.log("Updating b to 3");
  b.accessor(3); // Log here
}
main();
