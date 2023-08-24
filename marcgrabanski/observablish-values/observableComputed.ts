class Observable {
  static _computeActive: Observable | null = null;
  static _computeChildren: Observable[] = [];

  value: any;

  constructor(initialValue: any) {
    this.value = initialValue;
  }

  // This is the getter for the observable's value.
  get value() {
    if (
      Observable._computeActive &&
      !Observable._computeChildren.includes(this)
    ) {
      Observable._computeChildren.push(this);
    }
    return this.value;
  }

  static startComputation(observable: Observable, computation: Function) {
    Observable._computeActive = observable;
    computation();
    Observable._computeChildren.forEach((child) =>
      child.subscribe(() => _computeActive.compute)
    );
    Observable._computeActive = null;
  }
}

// Usage:
const a = new Observable(1);
const b = new Observable(2);

const computeSum = () => {
  const sum = a.value + b.value;
  console.log(`Sum: ${sum}`);
};
const parentObs = new Observable(computeSum);
console.log(`parentObs.value ${parentObs.value}`);
Observable.startComputation(parentObs, computeSum);

Observable.startComputation(null, computeSum); // Output: Sum: 3
