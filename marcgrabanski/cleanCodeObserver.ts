interface IObserver {
  next(value: string): void;
  error(err: any): void;
  complete(): void;
}
interface IProducer {
  produce(observer: IObserver): () => void;
}
interface IObservable {
  subscribe(): { unsubscribe: () => void };
}
class PizzaObserver implements IObserver {
  next(value: string) {
    console.log("Pizza:", value);
  }
  error(err: any) {
    console.log("Pizza Error:", err);
  }
  complete() {
    console.log("Pizza Complete!");
  }
}
class DrinkObserver implements IObserver {
  next(value: string) {
    console.log("Drink:", value);
  }
  error(err: any) {
    console.log("Drink Error:", err);
  }
  complete() {
    console.log("Drink Complete!");
  }
}
class PizzaProducer implements IProducer {
  produce(observer: IObserver) {
    observer.next("Pepperoni Pizza");
    observer.next("Margherita Pizza");
    observer.next("Hawaiian Pizza");
    observer.complete();
    return () => console.log("Pizza Unsubscribed");
  }
}
class DrinkProducer implements IProducer {
  produce(observer: IObserver) {
    observer.next("Soda");
    observer.next("Water");
    observer.next("Juice");
    observer.complete();
    return () => console.log("Drink Unsubscribed");
  }
}
class Observable implements IObservable {
  private observer: IObserver;
  private producer: IProducer;
  constructor(observer: IObserver, producer: IProducer) {
    this.observer = observer;
    this.producer = producer;
  }
  subscribe() {
    const unsubscribe = this.producer.produce(this.observer);
    return {
      unsubscribe: () => {
        if (unsubscribe && typeof unsubscribe === "function") {
          unsubscribe();
        }
      },
    };
  }
}
async function main() {
  const pizzaObserver = new PizzaObserver();
  const drinkObserver = new DrinkObserver();
  const pizzaProducer = new PizzaProducer();
  const drinkProducer = new DrinkProducer();
  const pizzaObservable = new Observable(pizzaObserver, pizzaProducer);
  const drinkObservable = new Observable(drinkObserver, drinkProducer);
  pizzaObservable.subscribe();
  drinkObservable.subscribe();
}
main();
