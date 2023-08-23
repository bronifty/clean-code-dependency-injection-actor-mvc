export default function ov(...args) {
  // JS functions can't inherit custom prototypes, so we use prop() as a
  // proxy to the real ObservableValue instead.
  const observable = new ObservableValue();
  // Defining prop function: A new function named prop is defined. This function takes any number of arguments and applies them to the observable.accessor method. Essentially, calling prop(...args) is equivalent to calling observable.accessor(...args).
  function prop(...args) {
    return observable.accessor.apply(prop, args);
  }

  for (const key in observable) {
    if (typeof observable[key] === "function") {
      prop[key] = observable[key];
    } else {
      Object.defineProperty(prop, key, {
        get: () => observable[key],
        set: (value) => {
          observable[key] = value;
        },
      });
    }
  }

  prop(...args);
  return prop;
}

function ObservableValue() {
  this.previousValue = null;
  this.value = null;
  this.subscribers = [];
}

ObservableValue._computeActive = false;
ObservableValue._computeChildren = [];

ObservableValue.prototype.accessor = function accessor(newValue) {
  // If no arguments, return the value. If called inside a computed observable
  // value function, track child observables.

  // 1. If there are no arguments, return the value
  // This part of the code is handling a "get" operation. When the accessor method is called without any arguments, it's being asked to return the current value of the observable.

  // Here's an example:
  // const obsValue = ov("initial");
  // console.log(obsValue()); // Output: 'initial'
  // In this case, obsValue() is calling the accessor method with no arguments, so the code returns this.value, which is the current value of obsValue.

  if (!arguments.length) {
    // get method -eg ov1()
    if (
      // _computeActive is set to true when recalculate is called
      ObservableValue._computeActive &&
      ObservableValue._computeChildren.indexOf(this) === -1
    ) {
      ObservableValue._computeChildren.push(this);
    }
    return this.value;
  }

  // If new value is same as previous, skip.
  else if (newValue !== this.value) {
    // If new value is not a function, save and publish.
    if (typeof newValue !== "function") {
      this.previousValue = this.value;
      this.value = newValue;
      this.publish();
    }

    // If new value is a function, call the function and save its result.
    // Function can return a promise for async assignment. All additional
    // arguments are passed to the value function.
    else {
      const args = [];
      for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];
        args.push(arg);
      }
      this.valueFunction = newValue;
      this.valueFunctionArgs = args;

      // Subscribe to child observables
      ObservableValue._computeActive = true;
      this.compute();
      ObservableValue._computeActive = false;
      ObservableValue._computeChildren.forEach((child) => {
        child.subscribe(() => this.compute());
      });
      ObservableValue._computeChildren.length = 0;
    }
  }
};

ObservableValue.prototype.publish = function publish() {
  this.subscribers.slice().forEach((handler) => {
    if (!handler) return;
    handler.call(this, this.value, this.previousValue);
  });
};

ObservableValue.prototype.subscribe = function subscribe(handler, immediate) {
  this.subscribers.push(handler);
  if (immediate) {
    handler.call(this, this.value, this.previousValue);
  }
};

ObservableValue.prototype.unsubscribe = function unsubscribe(handler) {
  const index = this.subscribers.indexOf(handler);
  this.subscribers.splice(index, 1);
};

// Note, currently there's no shortcut to cleanup a computed value.
// the compute function is specific to a computed observable; a regular observable without observable dependency calcs would merely have its get accessor called to retrieve the value without any calculation required, because, even if a regular observable was passed a function, that observable would have the result of the function stored in its value property, which would be accessed by the no-arg accessor method, not calculate
// the promise logic would be similar -in the case of a class using get and set implicit accessor method with the value property - to saying

// if (typeof result.then === "function") {
//       result.then((asyncResult) => this.value = asyncResult);
//     } else {
//       this.value = result;
//     }

// const a = new Observable(1)
// cons computed = new Observable(() => a.value + 1)
ObservableValue.prototype.compute = function compute() {
  const result = this.valueFunction.apply(this, this.valueFunctionArgs);
  if (typeof result !== "undefined") {
    if (typeof result.then === "function") {
      result.then((asyncResult) => this(asyncResult));
    } else {
      this(result);
    }
  }
};

// Function that logs changes to the console
const logChanges = (current, previous) => {
  console.log(`Changed from ${previous} to ${current}`);
};

// Creating observable values
const obsValue = ov("initial");
obsValue.subscribe(logChanges);
console.log(obsValue()); // 'initial'
obsValue("initial"); // identical value, no change
obsValue("new"); // logChanges('new', 'initial')
obsValue.value = "silent"; // silent update

// Working with arrays
const obsArray = ov([1, 2, 3]);
obsArray.subscribe(logChanges);
obsArray().push(4); // silent update
obsArray.publish(); // logChanges([1, 2, 3, 4]);
obsArray([4, 5]); // logChanges([4, 5], [1, 2, 3, 4]);

// Working with computed observables
const a = ov(1);
const b = ov(2);
const computed = ov((arg) => a() + b() + arg, 3);
computed.subscribe(logChanges);
console.log(computed()); // logChanges(6)
a(2); // logChanges(7, 6)
