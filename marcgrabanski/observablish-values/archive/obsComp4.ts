class Observable {
  private _value: any;
  private _subscribers: Function[] = [];
  private static _computeActive: Observable | null = null;
  private _computeFunction: Function | null = null;
  private static _computeChildren: Observable[] = [];

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
  }

  publish() {
    this._subscribers.forEach((handler) => handler(this._value));
  }

  compute() {
    if (this._computeFunction) {
      Observable._computeActive = this;
      this._value = this._computeFunction();
      this.publish();
      Observable._computeActive = null;
      Observable._computeChildren.forEach((child) =>
        child.subscribe(() => this.compute())
      );
      Observable._computeChildren.length = 0;
    }
  }
}

// Usage:
const a2 = new Observable(1);
const b2 = new Observable(1);
const c2 = new Observable(1);

const computeSum = () => a2.value + b2.value + c2.value;
const parentObs = new Observable(computeSum);
parentObs.subscribe((sum) => console.log(`Sum: ${sum}`));
console.log(`parentObs.value: ${parentObs.value}`); // Output: Sum: 3

a2.value = 2; // Triggers recomputation: Output: Sum: 5
b2.value = 2; // Triggers recomputation: Output: Sum: 6
c2.value = 2; // Triggers recomputation: Output: Sum: 7
