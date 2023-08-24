function ObservableValue() {
  this.previousValue = null;
  this.value = null;
  this.subscribers = [];
}
ObservableValue._computeActive = false;
ObservableValue._computeChildren = [];

export default function ov(...args) {
  // JS functions can't inherit custom prototypes, so we use prop() as a
  // proxy to the real ObservableValue instead.
  const observable = new ObservableValue();
  // Defining prop function: A new function named prop is defined. This function takes any number of arguments and applies them to the observable.accessor method. Essentially, calling prop(...args) is equivalent to calling observable.accessor(...args).

  // accessor on the prototype chain is equivalent to get() and set() in a class, which manipulates the internal value property with dot notation
  // eg observable.value = 1; (the set() accessor)
  // eg observable.value; (the get() accessor)
  // this is what a class with value prop and set and get accessor to manipulate it looks like:
  // class Observable {
  //   _value = null;
  //   constructor(initialValue) {
  //     this._value = initialValue;
  //   }
  //   set value(newValue) {
  //     this._value = newValue;
  //   }
  //   get value() {
  //     return this._value;
  //   }
  // }

  // prop functions as a proxy for 'observable' the instance of ObservableValue created above. any calls to prop are calls to the observable accessor method (by proxy because it returns a call to its accessor with apply using itself -aka the observable object- as the 'this' or context)
  function prop(...args) {
    // apply(prop, args) means call observable.accessor(args)
    return observable.accessor.apply(prop, args);
  }

  for (const key in observable) {
    if (typeof observable[key] === "function") {
      // prop[key] = observable[key];  means prop is acting as the observable object instance here and it's saying the property of the observable instance key is assigned to the value of the observable at the index of key
      // here is an example where prop is essentially actiing as the 'target'; this is a workaround for functions before classes were available
      // const source = {
      //   a: 1,
      //   b: 2,
      //   c: 3
      // };
      // const target = {};
      // for (const key in source) {
      //   target[key] = source[key];
      // }
      // console.log(target); // { a: 1, b: 2, c: 3 }
      // specifically this code prop[key] = observable[key] means that some identifier (eg 'value') will be set to the value returned at the index of the observable's key, which in this case (when the key is a function), will be the definition of the function - eg
      // function ObservableValue() {
      //   this.value = function () {
      //     return 2;
      //   };
      // }
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
      // if _computeActive is true we are in the middle of a recalculation of the computed dependencies; make sure that all dependencies are on the _computeChildren array
      ObservableValue._computeActive &&
      ObservableValue._computeChildren.indexOf(this) === -1
    ) {
      ObservableValue._computeChildren.push(this);
    }
    return this.value; // the no arg accessor (get()) returns this.value
  }
  // if there are args passed into the accessor (set(newValue))
  // If new value is same as previous, skip; makes it idempotent
  else if (newValue !== this.value) {
    // If new value is not a function, save and publish.
    if (typeof newValue !== "function") {
      this.previousValue = this.value;
      this.value = newValue;
      this.publish(); // loop over subscriptions and call their handler methods with new and previous values
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
      // const a = ov(1);
      // const b = ov(2);
      // const computed = ov((arg) => a() + b() + arg, 3);
      // {
      //   this.valueFunction = (args) => {a() + b() + args}
      //   this.valueFunctionArgs = [3]
      // }
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
console.log(computed()); // 6
a(2); // changed from 6 to 7

// The code snippet you provided is designed to work with a specific pattern where the getter is invoked without arguments (e.g., a()). If you change the implementation to use a class-based approach with standard TypeScript getters (e.g., a.value), this code won't work as intended, as the getter won't be called with no arguments.

// To adapt this code for a class-based implementation, you will need to modify how you track dependencies. Here's one possible approach:

// Define a Context: You can define a context object that stores the currently computing observable (e.g., the parent computed observable) and its dependencies.

// Track Access: Whenever a getter for an observable is accessed within a computation, add that observable to the list of dependencies for the currently computing observable.

// Use a Method to Start/End Computation: Create a method that sets the context for a computation, runs the computation, and then clears the context.
