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
