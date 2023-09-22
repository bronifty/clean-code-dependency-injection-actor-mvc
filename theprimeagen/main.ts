import { flattenArray, compose, curry } from "./utils/index.ts";
import { data, DataFactory, Person } from "./data/index.ts";

const map = curry((fn, outerArray) => outerArray.map(fn));
const flatten = (innerArray) => flattenArray(innerArray);

function buildObject(data: (string | number)[]): Person {
  return data.reduce(
    (acc: any, curr: string | number, index: number) => {
      switch (index % 6) {
        case 0:
          acc.name = <string>curr;
          break;
        case 1:
          acc.age = <number>curr;
          break;
        case 2:
          acc.address = { ...acc.address, street: <string>curr };
          break;
        case 3:
          acc.address = { ...acc.address, city: <string>curr };
          break;

        // ...
        case 4:
          acc.address = {
            ...acc.address,
            coordinates: [<number>curr, undefined],
          };
          break;
        case 5:
          acc.address = {
            ...acc.address,
            coordinates: [acc.address.coordinates[0], <number>curr],
          };
          break;
      }
      return acc;
    },
    { name: "", age: 0, address: { street: "", city: "", coordinates: [0, 0] } }
  );
}

// const pipe = compose(map(flatten), map(buildObject));
// console.log(pipe(data));

const flatArrays = map(flatten)(data);
const output = map(buildObject)(flatArrays);
console.log(output);
