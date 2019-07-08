const generateSchema = require("../src/index");

const customers = [
  {
    Id: "8198f931-f31d-4051-8964-5efe1d804a19",
    FirstName: "OM",
    Gender: "Male",
    BirthDate: "2000-04-01",
    DivisionCode: "PRP",
    NumberAndString: "test",
    BooleanAndString: true,
    JustBoolean: true,
    Salary: 10023.456787,
    DateUpdated: "2018-01-16T23:33:01+00:00"
  },
  {
    Id: "f0da3cca-a6ef-434b-bd54-e707e3e54a03",
    FirstName: "Neil",
    Gender: "Male",
    BirthDate: "1999-05-01",
    DivisionCode: "SFW",
    NumberAndString: "test",
    BooleanAndString: false,
    JustBoolean: false,
    Salary: -10023.5,
    DateUpdated: "2018-01-16T23:33:01+00:00"
  },
  {
    Id: "8198f931-f31d-4051-8964-5efe1d804a19",
    FirstName: "Renu",
    Gender: "Female",
    BirthDate: "2002-04-01",
    DivisionCode: "HDW",
    NumberAndString: "one",
    BooleanAndString: "false",
    JustBoolean: true,
    Salary: 10023.7,
    DateUpdated: "2018-01-16T23:33:01+00:00"
  },
  {
    Id: "e895aa94-8329-48a1-9f16-5e675f620eb7_INACTIVE",
    FirstName: "Candy",
    Gender: "Female",
    BirthDate: "March 10",
    DivisionCode: "2018-01-16T23:33:44+00:00",
    NumberAndString: 10,
    BooleanAndString: true,
    JustBoolean: true,
    Salary: 10023.4501,
    DateUpdated: "2018-01-16T23:33:44+00:00"
  }
];

describe('Schema with no Enums()', () => {
  test("Schema with no Enums", () => {
    const schema = generateSchema.json("Customer", customers);
    // console.log("Without enums", JSON.stringify(schema, null, 2));
    expect(schema.items.properties.Id).toBeDefined();
    expect(schema.items.properties.DivisionCode.format).toBeDefined();
    expect(schema.items.properties.DivisionCode.format).toBe("date-time");
    expect(schema.items.properties.DivisionCode.enum).toBeUndefined();
  });
});

test("Schema with Popular Format", () => {
  const schema = generateSchema.json("Customer", customers, {
    pickPopularFormat: true
  });
  // console.log("Without enums", JSON.stringify(schema, null, 2));
  expect(schema.items.properties.Id).toBeDefined();
  expect(schema.items.properties.DivisionCode.format).toBeDefined();
  expect(schema.items.properties.DivisionCode.format).toBe("string");
  expect(schema.items.properties.DivisionCode.enum).toBeUndefined();
  expect(schema.items.properties.JustBoolean.format).toBe("boolean");
  //expect(schema.items.properties.BooleanAndString.format).toBe("string");
  expect(schema.items.properties.BooleanAndString.format).toBe("boolean");
});

test("Schema with Format counts", () => {
  const schema = generateSchema.json("Customer", customers, {
    addFormatCounts: true
  });
  // console.log("Without enums", JSON.stringify(schema, null, 2));
  expect(schema.items.properties.Id).toBeDefined();
  expect(schema.items.properties.DivisionCode.format).toBeDefined();
  expect(schema.items.properties.DivisionCode.formats).toBeDefined();
});

test("Schema with Enums", () => {
  const schema = generateSchema.json("Customer", customers, {
    generateEnums: true,
    maxEnumValues: 2,
    generateLengths: true
  });
  // console.log("Without enums", JSON.stringify(schema, null, 2));
  expect(schema.items.properties.Id).toBeDefined();
  expect(schema.items.properties.DivisionCode.enum).toBeDefined();
});
