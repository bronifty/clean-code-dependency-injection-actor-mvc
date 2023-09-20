type Coordinates = [lat: number, long: number];

type Address = {
  street: string;
  city: string;
  coordinates: Coordinates;
};

type Person = {
  name: string;
  age: number;
  address: Address;
};

class DataFactory {
  static *generator(data: (string | number)[]) {
    let index = 0;
    while (index < data.length) {
      yield data[index++];
    }
  }
}

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

const data = ["John Doe", 30, "123 Main St", "Some City", 52.52, 13.405];
const result = buildObject(data);
console.log(result);
