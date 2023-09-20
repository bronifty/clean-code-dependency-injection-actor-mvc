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
export class DataFactory {
  static *generator(data: (string | number)[]) {
    let index = 0;
    while (index < data.length) {
      yield data[index++];
    }
  }
}
export const data = [
  ["John Doe", 30, ["123 Main St", "Some City", [52.52, 13.405]]],
  ["Jane Doe", 32, ["456 Main St", "Another City", [40.7128, 74.006]]],
];
// const schema = {
//     name: 'string',
//     age: 'number',
//     address: {
//       street: 'string',
//       city: 'string',
//       coordinates: ['number', 'number']
//     }
//   };
