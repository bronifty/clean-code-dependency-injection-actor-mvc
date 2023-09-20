import { flattenArray, compose, curry } from "./utils/index.ts";
import { data, DataFactory, Person } from "./data/index.ts";

const map = curry((fn, outerArray) => outerArray.map(fn));
const flatten = (innerArray) => flattenArray(innerArray);
function buildObject(data: (string | number)[]): Person {
  const dataGen = DataFactory.generator(data);
  return {
    name: <string>dataGen.next().value,
    age: <number>dataGen.next().value,
    address: {
      street: <string>dataGen.next().value,
      city: <string>dataGen.next().value,
      coordinates: [<number>dataGen.next().value, <number>dataGen.next().value],
    },
  };
}
const composer = compose(map(flatten), map(buildObject));
console.log(composer(data));
