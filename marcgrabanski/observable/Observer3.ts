interface IObserver<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}
interface IObservable<T> {
  subscribe(observer: IObserver<T>): { unsubscribe: () => void };
}
class Observer<T> implements IObserver<T> {
  next(value: T) {
    console.log("Received:", value);
  }
  error(err: any) {
    console.log("Error:", err);
  }
  complete() {
    console.log("Complete!");
  }
}
class Observable<T> implements IObservable<T> {
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
class ObserverFactory {
  static create<T>(): IObserver<T> {
    return new Observer<T>();
  }
}
class ObservableFactory {
  static create<T>(
    producer: (observer: IObserver<T>) => () => void
  ): IObservable<T> {
    return new Observable<T>(producer);
  }
}
async function main() {
  const producer = (observer: IObserver<string>) => {
    observer.next("Pepperoni Pizza");
    observer.next("Margherita Pizza");
    observer.next("Hawaiian Pizza");
    observer.complete();
    return () => console.log("Unsubscribed");
  };

  // Use factory classes to create Observer and Observable
  const observable = ObservableFactory.create<string>(producer);
  const observer = ObserverFactory.create<string>();

  const subscription = observable.subscribe(observer);
}

main();
