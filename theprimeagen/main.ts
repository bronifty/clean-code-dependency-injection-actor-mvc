export const flattenArray = (arr) =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val),
    []
  );
export const compose =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
export const curry =
  (fn) =>
  (...args) => {
    if (args.length >= fn.length) {
      return fn.apply(null, args);
    }
    return fn.bind(null, ...args);
  };
export type Coordinates = [lat: number, long: number];
export type Address = {
  street: string;
  city: string;
  coordinates: Coordinates;
};
export type Person = {
  name: string;
  age: number;
  address: Address;
};

export const data = [
  ["John Doe", 30, ["123 Main St", "Some City", [52.52, 13.405]]],
  ["Jane Doe", 32, ["456 Main St", "Another City", [40.7128, 74.006]]],
];

const map = curry((fn, outerArray) => outerArray.map(fn));
const flatten = (innerArray) => flattenArray(innerArray);
function buildObject(data: (string | number)[]): Person {
  let dataIndex = 0;
  return {
    name: <string>data[dataIndex++],
    age: <number>data[dataIndex++],
    address: {
      street: <string>data[dataIndex++],
      city: <string>data[dataIndex++],
      coordinates: [<number>data[dataIndex++], <number>data[dataIndex++]],
    },
  };
}
const composer = compose(map(flatten), map(buildObject));
console.log(composer(data));
