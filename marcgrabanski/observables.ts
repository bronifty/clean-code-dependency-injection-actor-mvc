class Observable {
  constructor(producer) {
    this.producer = producer;
  }
  subscribe(observer) {
    if (typeof observer !== "object" || observer === null) {
      throw new Error(
        "Observer must be an object with next, error, and complete methods"
      );
    }
    if (typeof observer.next !== "function") {
      throw new Error("Observer must have a next method");
    }
    if (typeof observer.error !== "function") {
      throw new Error("Observer must have an error method");
    }
    if (typeof observer.complete !== "function") {
      throw new Error("Observer must have a complete method");
    }
    const unsubscribe = this.producer(observer);
    return {
      unsubscribe: () => {
        if (unsubscribe && typeof unsubscribe === "function") {
          unsubscribe();
        }
      },
    };
  }
}

// const producer = (observer) => {
//   observer.next('Pepperoni Pizza');
//   observer.next('Margherita Pizza');
//   observer.next('Hawaiian Pizza');
//   observer.complete();
//   return () => console.log('Unsubscribed');
// };
// const observable = new Observable(producer);
// const observer = {
//   next: (value) => console.log('Received:', value),
//   error: (error) => console.log('Error:', error),
//   complete: () => console.log('Complete!'),
// };
// const subscription = observable.subscribe(observer);
// console.log('Subscription:', subscription);

// // Optionally, you can call the unsubscribe method to see the unsubscribe message
// // subscription.unsubscribe();

// Create a new observable that emits three values and then completes
const producer = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();

  // Optional: Return a function to handle any cleanup if the observer unsubscribes
  return () => {
    console.log("Observer unsubscribed");
  };
});

// Define an observer with next, error, and complete methods
const observer = {
  next: (value) => console.log("Received value:", value),
  error: (err) => console.log("Error:", err),
  complete: () => console.log("Completed"),
};

// Subscribe to the observable
const subscription = observable.subscribe(observer);

// Optionally, you can later unsubscribe to stop receiving values
subscription.unsubscribe();
