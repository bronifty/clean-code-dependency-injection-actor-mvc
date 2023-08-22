interface IObserver<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}
interface IObservable<T> {
  subscribe(): { unsubscribe: () => void };
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
  private observer: IObserver<T>;
  private producer: (observer: IObserver<T>) => () => void;
  constructor(
    observer: IObserver<T>,
    producer: (observer: IObserver<T>) => () => void
  ) {
    this.observer = observer;
    this.producer = producer;
  }
  subscribe() {
    const unsubscribe = this.producer(this.observer);
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
    observer: IObserver<T>,
    producer: (observer: IObserver<T>) => () => void
  ): IObservable<T> {
    return new Observable<T>(observer, producer);
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
  const observer = ObserverFactory.create<string>();
  const observable = ObservableFactory.create<string>(observer, producer);

  const subscription = observable.subscribe();
}

main();
