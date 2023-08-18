interface Calculator {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
}
const calculator: Calculator = {
  add: function (a: number, b: number): number {
    return a + b;
  },
  subtract: function (a: number, b: number): number {
    return a - b;
  },
};
const proxyHandler: ProxyHandler<Calculator> = {
  get(target, property: keyof Calculator) {
    if (typeof target[property] === "function") {
      return function (...args: number[]) {
        const result = target[property](...args);
        console.log(
          `${
            property.charAt(0).toUpperCase() + property.slice(1)
          } method called with arguments: ${args.join(", ")}. Result: ${result}`
        );
        return result;
      };
    }
    return target[property];
  },
};
const proxiedCalculator = new Proxy(calculator, proxyHandler);
console.log(proxiedCalculator.add(5, 3));
console.log(proxiedCalculator.subtract(5, 3));
