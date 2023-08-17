interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}
class BasicCalculator implements Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
  subtract(a: number, b: number): number {
    return a - b;
  }
}
interface Notifier {
  notify(method: string, args: number[], result: number): void;
}
class ConsoleNotifier implements Notifier {
  notify(method: string, args: number[], result: number): void {
    console.log(
      `${
        method.charAt(0).toUpperCase() + method.slice(1)
      } method called with arguments: ${args.join(", ")}. Result: ${result}`
    );
  }
}
class CalculatorFactory {
  static createProxiedCalculator(
    calc: Calculator,
    notifier: Notifier
  ): Calculator {
    return new Proxy(calc, {
      get(target, property: keyof Calculator) {
        if (typeof target[property] === "function") {
          return function (...args: number[]) {
            const result = target[property](...args);
            notifier.notify(property, args, result);
            return result;
          };
        }
        return target[property];
      },
    });
  }
}
const basicCalculator = new BasicCalculator();
const consoleNotifier = new ConsoleNotifier();
const proxiedCalculator = CalculatorFactory.createProxiedCalculator(
  basicCalculator,
  consoleNotifier
);
proxiedCalculator.add(5, 3);
proxiedCalculator.subtract(5, 3);
