interface IObserver<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}
class Observable<T> {
  private producer: (observer: IObserver<T>) => () => void;

  constructor(producer: (observer: IObserver<T>) => () => void) {
    this.producer = producer;
  }
  subscribe(observer: IObserver<T>) {
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

// Concrete Implementation
const observer: IObserver<string> = {
  next: (value) => console.log("Received:", value),
  error: (error) => console.log("Error:", error),
  complete: () => console.log("Complete!"),
};

async function main() {
  const producer = (observer: IObserver<string>) => {
    observer.next("Pepperoni Pizza");
    observer.next("Margherita Pizza");
    observer.next("Hawaiian Pizza");
    observer.complete();
    return () => console.log("Unsubscribed");
  };
  const observable = new Observable<string>(producer);
  const subscription = observable.subscribe(observer);
}
main();
