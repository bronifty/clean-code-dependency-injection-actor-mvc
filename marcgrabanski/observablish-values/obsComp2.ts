class Observable {
  static _computeActive: Observable | null = null;
  static _computeChildren: Observable[] = [];

  private _value: any;
  private _subscribers: Function[] = [];

  constructor(initialValue: any) {
    this._value = initialValue;
  }

  // This is the getter for the observable's value.
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
  }

  publish() {
    this._subscribers.forEach((handler) => handler(this._value));
  }

  static startComputation(observable: Observable, computation: Function) {
    Observable._computeActive = observable;
    computation();
    Observable._computeChildren.forEach((child) =>
      child.subscribe(() => observable.compute(computation))
    );
    Observable._computeActive = null;
    Observable._computeChildren.length = 0; // Clear the children array
  }

  compute(computation: Function) {
    this._value = computation();
    this.publish();
  }
}

// Usage:
const a = new Observable(1);
const b = new Observable(2);

const computeSum = () => {
  return a.value + b.value; // Must return the computed value
};
const parentObs = new Observable(computeSum());
parentObs.subscribe((sum) => console.log(`Sum: ${sum}`));

Observable.startComputation(parentObs, computeSum);

a.value = 3; // Triggers recomputation: Output: Sum: 5
b.value = 3; // Triggers recomputation: Output: Sum: 6
