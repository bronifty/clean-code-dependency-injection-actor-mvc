interface ISchema {
  [key: string]: string | number | ISchema | ISchema[];
}
interface IObjectBuilder {
  buildObject(schema: ISchema, data: any[]): any;
}
class ObjectBuilder implements IObjectBuilder {
  buildObject(schema: ISchema, data: any[]): any {
    if (Array.isArray(schema)) {
      return data.map((item, index) => this.buildObject(schema[0], item));
    } else if (typeof schema === 'object') {
      return Object.keys(schema).reduce((obj, key, index) => {
        obj[key] = this.buildObject(schema[key], data[index]);
        return obj;
      }, {});
    } else {
      return data;
    }
  }
}
class ObjectBuilderFactory {
  static createObjectBuilder(): IObjectBuilder {
    return new ObjectBuilder();
  }
}
const schema: ISchema = {
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
    coordinates: ['number', 'number']
  }
};
const data = ['John Doe', 30, ['123 Main St', 'Some City', [52.5200, 13.4050]]];

const objectBuilder = ObjectBuilderFactory.createObjectBuilder();
const result = objectBuilder.buildObject(schema, data);
console.log(result);





