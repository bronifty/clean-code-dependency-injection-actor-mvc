interface IObservable {
  value: any;
  subscribe(handler: Function): Function;
  push(item: any): void;
  publish(): void;
}

class Observable implements IObservable {
  private _value: any;
  private _previousValue: any;
  private _subscribers: Function[] = [];
  private static _computeActive: Observable | null = null;
  private _computeFunction: Function | null = null;
  private static _computeChildren: Observable[] = [];
  private _childSubscriptions: Function[] = [];

  constructor(initialValue: any) {
    this._previousValue = undefined; // Initialize _previousValue
    if (typeof initialValue === "function") {
      this._computeFunction = initialValue;
      this.compute();
    } else {
      this._value = initialValue;
    }
  }

  get value() {
    if (
      Observable._computeActive &&
      !Observable._computeChildren.includes(this)
    ) {
      Observable._computeChildren.push(this);
    }
    return this._value;
  }

  set value(newValue: any) {
    this._previousValue = this._value; // Store the current value as the previous value
    this._value = newValue;
    this.publish();
  }

  push(item: any) {
    if (Array.isArray(this._value)) {
      this._value.push(item);
    } else {
      throw new Error("Push can only be called on an observable array.");
    }
  }

  subscribe(handler: Function) {
    this._subscribers.push(handler);
    return () => {
      const index = this._subscribers.indexOf(handler);
      if (index > -1) {
        this._subscribers.splice(index, 1);
      }
    };
  }

  publish() {
    this._subscribers.forEach((handler) =>
      handler(this._value, this._previousValue)
    ); // Pass both current and previous values
  }

  // called by child observable subscriptions and by the constructor
  private compute() {
    if (this._computeFunction) {
      // Unsubscribe old child subscriptions
      this._childSubscriptions.forEach((unsubscribe) => unsubscribe());
      this._childSubscriptions.length = 0;

      Observable._computeActive = this;
      this._previousValue = this._value; // Store the current value as the previous value
      this._value = this._computeFunction();
      this.publish();
      Observable._computeActive = null;
      Observable._computeChildren.forEach((child) =>
        this._childSubscriptions.push(child.subscribe(() => this.compute()))
      );
      Observable._computeChildren.length = 0;
    }
  }
}

class ObservableFactory {
  static create(initialValue: any): IObservable {
    return new Observable(initialValue);
  }
}

async function main() {
  // Function that logs changes to the console
  const logChanges = (current, previous) => {
    console.log(`Changed to ${current} from ${previous} `);
  };
  // Creating observable values
  console.log("Creating observable values");
  const obsValue = ObservableFactory.create("initial");
  obsValue.subscribe(logChanges);
  console.log(obsValue.value); // 'initial'
  obsValue.value = "second"; // logChanges('second', 'initial');

  // Working with arrays
  console.log("Working with arrays");
  const obsArray = ObservableFactory.create([1, 2, 3]);
  obsArray.subscribe(logChanges);
  console.log(obsArray.value); // [1, 2, 3]
  obsArray.push(4); // silent update
  obsArray.publish(); // logChanges([1, 2, 3, 4]);
  obsArray.push(5); // silent update
  obsArray.publish(); // logChanges([1, 2, 3, 4, 5]);
  obsArray.value = [4, 5]; // logChanges([4, 5], [1, 2, 3, 4]);

  // Working with computed observables
  console.log("Working with computed observables");
  const a = ObservableFactory.create(1);
  const b = ObservableFactory.create(1);
  const c = ObservableFactory.create(1);
  const computeSum = () => a.value + b.value + c.value;
  const computed = ObservableFactory.create(computeSum);
  computed.subscribe(logChanges);
  console.log(`computed.value: ${computed.value}`); // computed.value: 3
  a.value = 2; // Changed to 4 from 3
  b.value = 2; // Changed to 5 from 4
  c.value = 2; // Changed to 6 from 5
}

main();
