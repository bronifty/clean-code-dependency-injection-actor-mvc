class Observable {
  private _value: any;
  private _subscribers: Function[] = [];
  private static _computeActive: Observable | null = null;
  private _computeFunction: Function | null = null;
  private static _computeChildren: Observable[] = [];
  private _childSubscriptions: Function[] = [];

  constructor(initialValue: any) {
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
    this._value = newValue;
    this.publish();
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
    this._subscribers.forEach((handler) => handler(this._value));
  }
  // called by child observable subscriptions and by the constructor
  private compute() {
    if (this._computeFunction) {
      // Unsubscribe old child subscriptions
      this._childSubscriptions.forEach((unsubscribe) => unsubscribe());
      this._childSubscriptions.length = 0;

      Observable._computeActive = this;
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

async function main() {
  // Function that logs changes to the console
  const logChanges = (current, previous) => {
    console.log(`Changed to ${current} from ${previous} `);
  };

  // Working with arrays
  const obsArray = new Observable([1, 2, 3]);
  obsArray.subscribe(logChanges);
  obsArray.value.push(4); // silent update
  obsArray.publish(); // logChanges([1, 2, 3, 4]);
  obsArray.value = [4, 5]; // logChanges([4, 5], [1, 2, 3, 4]);

  // Working with computed observables
  const a2 = new Observable(1);
  const b2 = new Observable(1);
  const c2 = new Observable(1);
  const computeSum = () => a2.value + b2.value + c2.value;
  const computed = new Observable(computeSum);
  computed.subscribe(logChanges);
  console.log(`computed.value: ${computed.value}`); // computed.value: 3
  a2.value = 2; // Triggers recomputation: Output: Sum: 5
  b2.value = 2; // Triggers recomputation: Output: Sum: 6
  c2.value = 2; // Triggers recomputation: Output: Sum: 7
}

main();
