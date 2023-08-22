const schema = {
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
    coordinates: ['number', 'number']
  }
};
const data = ['John Doe', 30, ['123 Main St', 'Some City', [52.5200, 13.4050]]];
function buildObject(schema: any, data: any): any {
  if (Array.isArray(schema)) {
    return data.map((item, index) => buildObject(schema[0], item));
  } else if (typeof schema === 'object') {
    return Object.keys(schema).reduce((obj, key, index) => {
      obj[key] = buildObject(schema[key], data[index]);
      return obj;
    }, {});
  } else {
    return data;
  }
}
const result = buildObject(schema, data);
console.log(result);


