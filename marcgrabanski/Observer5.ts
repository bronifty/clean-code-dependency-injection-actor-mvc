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
function dynamicProducer(
  type: string
): (observer: IObserver<string>) => () => void {
  return (observer: IObserver<string>) => {
    switch (type) {
      case "pizzas":
        observer.next("Pepperoni Pizza");
        observer.next("Margherita Pizza");
        observer.next("Hawaiian Pizza");
        break;
      case "drinks":
        observer.next("Soda");
        observer.next("Water");
        observer.next("Juice");
        break;
      default:
        observer.error("Unknown type");
        break;
    }
    observer.complete();
    return () => console.log("Unsubscribed");
  };
}
async function main() {
  const observer = ObserverFactory.create<string>();
  const producer = dynamicProducer("pizzas");
  const observable = ObservableFactory.create<string>(observer, producer);
  const subscription = observable.subscribe();
  const producer2 = dynamicProducer("drinks");
  const observable2 = ObservableFactory.create<string>(observer, producer2);
  const subscription2 = observable2.subscribe();
}
main();
