interface ISchemaStrategy {
  parseSchema(schema: any, data: any[]): any;
}
interface IObjectBuilder {
  buildObject(schema: ISchema, data: any[]): any;
}
class DefaultSchemaStrategy implements ISchemaStrategy {
  parseSchema(schema: any, data: any[]): any {
    if (Array.isArray(schema)) {
      return data.map((item) => this.parseSchema(schema[0], item));
    } else if (typeof schema === 'object') {
      return Object.keys(schema).reduce((obj, key, index) => {
        obj[key] = this.parseSchema(schema[key], data[index]);
        return obj;
      }, {});
    } else {
      return data;
    }
  }
}
class FlatArraySchemaStrategy implements ISchemaStrategy {
  parseSchema(schema: any, data: any[]): any {
    return schema.reduce((obj, key, index) => {
      obj[key.name] = data[index];
      return obj;
    }, {});
  }
}
class ObjectBuilder implements IObjectBuilder {
  private schemaStrategy: ISchemaStrategy;
  constructor(schemaStrategy: ISchemaStrategy) {
    this.schemaStrategy = schemaStrategy;
  }
  buildObject(schema: ISchema, data: any[]): any {
    return this.schemaStrategy.parseSchema(schema, data);
  }
}
class ObjectBuilderFactory {
  static createObjectBuilder(schemaStrategy: ISchemaStrategy): IObjectBuilder {
    return new ObjectBuilder(schemaStrategy);
  }
}

const schema1: ISchema = {
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
    coordinates: ['number', 'number']
  }
};
const data1 = ['John Doe', 30, ['123 Main St', 'Some City', [52.5200, 13.4050]]];
const schema2: ISchema = [
  { name: 'firstName', type: 'string' },
  { name: 'lastName', type: 'string' },
  { name: 'age', type: 'number' }
];
const data2 = ['Alice', 'Smith', 28];

async function main(){
const schemaStrategy = new DefaultSchemaStrategy();
const objectBuilder = ObjectBuilderFactory.createObjectBuilder(schemaStrategy);
const result1 = objectBuilder.buildObject(schema1, data1);
console.log(result1);

const flatArraySchemaStrategy = new FlatArraySchemaStrategy();
const newObjectBuilder = ObjectBuilderFactory.createObjectBuilder(flatArraySchemaStrategy);
const result2 = newObjectBuilder.buildObject(schema2, data2);
console.log(result2);
}
main()
