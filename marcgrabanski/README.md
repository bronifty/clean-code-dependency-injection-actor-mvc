[frontend masters blog article](https://frontendmasters.com/blog/vanilla-javascript-reactivity/)

1 works

```ts
const pubSub = {
  events: {
    // "update": [(data)=>console.log(data)]
  },

  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];

    this.events[event].push(callback);
  },

  publish(event, data) {
    if (this.events[event])
      this.events[event].forEach((callback) => callback(data));
  },
};

pubSub.subscribe("update", (data) => console.log(data));

pubSub.publish("update", "Some update"); // Some update
```

2 change name to type

```js
<script>

const pizzaEvent = new CustomEvent("pizzaDelivery", {

detail: {

type: "supreme",

},

});



window.addEventListener("pizzaDelivery", (e) => console.log(e.detail.type));

window.dispatchEvent(pizzaEvent);



</script>
```

3 change name to type

```js
<div id="pizza-store"></div>



<script>

const pizzaEvent = new CustomEvent("pizzaDelivery", {

detail: {

type: "hello pizza",

},

});



const pizzaStore = document.querySelector('#pizza-store');

pizzaStore.addEventListener("pizzaDelivery", (e) => console.log(e.detail.type));

pizzaStore.dispatchEvent(pizzaEvent);
```

4 EventTarget (might be good to introduce the concept)
EventTarget interface methods
[`EventTarget.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
[`EventTarget.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
[`EventTarget.dispatchEvent()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

```ts
class PizzaStore extends EventTarget {
  constructor() {
    super();
  }

  addPizza(flavor) {
    // fire event directly on the class

    this.dispatchEvent(
      new CustomEvent("pizzaAdded", {
        detail: {
          pizza: flavor,
        },
      })
    );
  }
}

const Pizzas = new PizzaStore();

Pizzas.addEventListener("pizzaAdded", (e) =>
  console.log("Added Pizza", e.detail)
);

Pizzas.addPizza("supreme");
```

5 observer works

```ts
class Subject {
  constructor() {
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log(data);
  }
}

const subject = new Subject();
const observer = new Observer();

subject.addObserver(observer);
subject.notify("Everyone gets pizzas!");
```

6 proxy works

```ts
const handler = {
  get: function (target, property) {
    console.log(`Getting property ${property}`);
    return target[property];
  },
  set: function (target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
    return true; // indicates that the setting has been done successfully
  },
};

const pizza = { name: "Margherita", toppings: ["tomato sauce", "mozzarella"] };
const proxiedPizza = new Proxy(pizza, handler);

console.log(proxiedPizza.name); // Outputs "Getting property name" and "Margherita"
proxiedPizza.name = "Pepperoni"; // Outputs "Setting property name to Pepperoni"
```

7 object define property

```ts
const pizza = {
  _name: "Margherita", // Internal property
};

Object.defineProperty(pizza, "name", {
  get: function () {
    console.log(`Getting property name`);

    return this._name;
  },

  set: function (value) {
    console.log(`Setting property name to ${value}`);

    this._name = value;
  },
});

// Example usage:

console.log(pizza.name); // Outputs "Getting property name" and "Margherita"

pizza.name = "Pepperoni"; // Outputs "Setting property name to Pepperoni"

console.log(pizza.name); // Outputs "Getting property name" and "Margherita"
```

- async observers - add example init and run

```ts
class AsyncData {
  constructor(initialData) {
    this.data = initialData;

    this.subscribers = [];
  }

  subscribe(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    this.subscribers.push(callback);
  }

  async set(key, value) {
    this.data[key] = value;

    const updates = this.subscribers.map(async (callback) => {
      await callback(key, value);
    });

    await Promise.allSettled(updates);
  }
}

const callback1 = async (key, value) => {
  console.log(`Callback 1: Key ${key} updated to ${value}`);
};

const callback2 = async (key, value) => {
  console.log(`Callback 2: Key ${key} updated to ${value}`);
};

const asyncData = new AsyncData({ pizza: "Margherita", drinks: "Soda" });

asyncData.subscribe(callback1);

asyncData.subscribe(callback2);

console.log("Initial data:", asyncData.data);

asyncData.set("pizza", "Pepperoni");

asyncData.set("pizza", "Pineapple Bacon");

console.log(" data:", asyncData.data);

// asyncData.set('pizza', 'Pepperoni').then(() => {

// console.log('Updated data:', asyncData.data);

// });

// asyncData.set('drinks', 'Water').then(() => {

// console.log('Updated data:', asyncData.data);

// });
```

- observables works
  - notes: observable is a producer of data that can be observed by an observer, which is the reactor to data inputs or what makes the observable reactive

```ts
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

// Example usage

const producer = (observer: IObserver<string>) => {
  observer.next("Pepperoni Pizza");

  observer.next("Margherita Pizza");

  observer.next("Hawaiian Pizza");

  observer.complete();

  return () => console.log("Unsubscribed");
};

const observable = new Observable<string>(producer);

const observer: IObserver<string> = {
  next: (value) => console.log("Received:", value),

  error: (error) => console.log("Error:", error),

  complete: () => console.log("Complete!"),
};

const subscription = observable.subscribe(observer);
```

- signals: context array is loaded up and pulled down then cleared out (each signal is a one-off based on context which is mutable)

```ts
interface ISignal<T> {
  read: () => T;
  write: (newValue: T) => void;
}
interface IEffect {
  execute(): void;
}
interface ISignalFactory {
  createSignal<T>(value: T): [() => T, (newValue: T) => void];
  createEffect(fn: () => void): Effect;
}
const context: IEffect[] = [];
class Signal<T> implements ISignal<T> {
  private value: T;
  private subscriptions: Set<IEffect> = new Set();
  constructor(value: T) {
    this.value = value;
  }
  read(): T {
    const observerEffect = context[context.length - 1];
    if (observerEffect) this.subscriptions.add(observerEffect);
    return this.value;
  }
  write(newValue: T): void {
    this.value = newValue;
    for (const observerEffect of this.subscriptions) {
      observerEffect.execute();
    }
  }
}
class Effect implements IEffect {
  private fn: () => void;
  constructor(fn: () => void) {
    this.fn = fn;
    this.execute();
  }
  execute(): void {
    context.push(this);
    this.fn();
    context.pop();
  }
}
class SignalFactory implements ISignalFactory {
  createSignal<T>(value: T): [() => T, (newValue: T) => void] {
    const signal = new Signal<T>(value);
    return [() => signal.read(), (newValue: T) => signal.write(newValue)];
  }
  createEffect(fn: () => void): Effect {
    return new Effect(fn);
  }
}
async function main() {
  const factory = new SignalFactory();
  const [count, setCount] = factory.createSignal(0);
  factory.createEffect(() => {
    console.log(count());
  });
  setCount(10);
}
main();
```
