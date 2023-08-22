const context = [];
export function createSignal(value) {
  const subscriptions = new Set();
  const read = () => {
    const observer = context[context.length - 1];
    if (observer) subscriptions.add(observer);
    return value;
  };
  const write = (newValue) => {
    value = newValue;
    for (const observer of subscriptions) {
      observer.execute();
    }
  };
  return [read, write];
}
export function createEffect(fn) {
  const effect = {
    execute() {
      context.push(effect);
      fn();
      context.pop();
    },
  };
  effect.execute();
}
const [count, setCount] = createSignal(0);
createEffect(() => {
  console.log(count());
}); // 0
setCount(10); // 10
