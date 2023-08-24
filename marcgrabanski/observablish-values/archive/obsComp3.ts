class Observable {
  private _value: any;
  private _subscribers: Function[] = [];
  private _computeFunction: Function | null = null;
  private _computeActive: boolean = false;
  private _computeChildren: Observable[] = [];

  constructor(initialValue: any) {
    if (typeof initialValue === "function") {
      this.compute(initialValue);
    } else {
      this._value = initialValue;
    }
  }

  // This is the getter for the observable's value.
  get value() {
    if (this._computeActive && !this._computeChildren.includes(this)) {
      this._computeChildren.push(this);
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

  // static startComputation(observable: Observable, computation: Function) {
  //   Observable._computeActive = observable;
  //   computation();
  //   Observable._computeChildren.forEach((child) =>
  //     child.subscribe(() => observable.compute(computation))
  //   );
  //   Observable._computeActive = null;
  //   Observable._computeChildren.length = 0; // Clear the children array
  // }

  compute(computation: Function) {
    // set computeActive to true
    // call computation
    // set computeActive to false
    // loop over children and subscribe to each child
    // clear children array
    this._computeActive = true;
    this._value = computation();
    this.publish(); // loop over subscribers and call each handler with the current this._value
    this._computeActive = false;
    this._computeChildren.forEach((child) =>
      child.subscribe(() => this.compute(computation))
    );
    this._computeChildren.length = 0; // Clear the children array
  }
}

// Usage:
const a = new Observable(1);
const b = new Observable(2);

const computeSum = () => {
  return a.value + b.value; // Must return the computed value
};
const parentObs = new Observable(computeSum);
parentObs.subscribe((sum) => console.log(`Sum: ${sum}`));
console.log(`parentObs.value: ${parentObs.value}`); // Output: Sum: 3
// Observable.startComputation(parentObs, computeSum);

a.value = 3; // Triggers recomputation: Output: Sum: 5
b.value = 3; // Triggers recomputation: Output: Sum: 6
