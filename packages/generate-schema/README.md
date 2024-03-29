# `@omkartech/generate-schema`

**Generate [JSON Schema] from JSON data with added date, UUID, enum, and length detection**

This package extends [generate-schema] to detect ISO dates, datetimes, enums, minLength, maxLength and UUIDs from the JSON and add appropriate format and size limits.

# Installation

```bash
npm install --save @omkartech/generate-schema
```
# Usage

```js
const generateSchema = require('@omkartech/generate-schema')
```

## Example

Generate JSON Schema with UUID and format detection (date, date-time)

```js
const customers = [{
  Id: '8198f931-f31d-4051-8964-5efe1d804a19',
  FirstName: 'Om',
  LastName: 'Tech',
  Gender: 'Male',
  BirthDate: '2001-01-03',
  DateUpdated: '2019-01-17T22:23:21+00:00'
},
{
  Id: 'abaa80cc-e0eb-4a33-8292-ec937ffe773b',
  FirstName: 'Gabe',
  LastName: 'Smith',
  Gender: 'Female',
  BirthDate: '1976-11-25',
  DateUpdated: '2017-01-16T22:23:24+00:00'
}]

const schema = generateSchema.json('Customer', customers)
```

### Outputs

```js
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Customer Set",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "Id": {
        "type": "string",
        "minLength": 36,
        "maxLength": 36
      },
      "FirstName": {
        "type": "string"
      },
      "LastName": {
        "type": "string"
      },
      "Gender": {
        "type": "string"
      },
      "BirthDate": {
        "type": "string",
        "format": "date"
      },
      "DateUpdated": {
        "type": "string",
        "format": "date-time"
      }
    },
    "required": [
      "Id",
      "FirstName",
      "LastName",
      "BirthDate",
      "DateUpdated"
    ],
    "title": "Customer"
  }
}
```

## Example

Generate JSON Schema with popular format deduction

```js
const Customers = [
  {
    Id: "8198f931-f31d-4051-8964-5efe1d804a19",
    FirstName: "Om",
    Gender: "Male",
    BirthDate: "2000-04-01",
    DivisionCode: "PRP",
    NumberAndString: "test",
    Salary: 1023.456787,
    DateUpdated: "2018-01-16T23:33:01+00:00"
  },
  {
    Id: "f0da3cca-a6ef-434b-bd54-e707e3e54a03",
    FirstName: "Nate",
    Gender: "Male",
    BirthDate: "1999-05-01",
    DivisionCode: "SFW",
    NumberAndString: "test",
    Salary: -10023.5,
    DateUpdated: "2018-01-16T23:33:01+00:00"
  },
  {
    Id: "8198f931-f31d-4051-8964-5efe1d804a19",
    FirstName: "Reka",
    Gender: "Female",
    BirthDate: "2002-04-01",
    DivisionCode: "HDW",
    NumberAndString: "one",
    Salary: 10023.7,
    DateUpdated: "2018-01-16T23:33:01+00:00"
  },
  {
    Id: "e895aa94-8329-48a1-9f16-5e675f620eb7_INACTIVE",
    FirstName: "Nelly",
    Gender: "Female",
    BirthDate: "March 10",
    DivisionCode: "2018-01-16T23:33:44+00:00",
    NumberAndString: 10,
    Salary: 10023.4501,
    DateUpdated: "2018-01-16T23:33:44+00:00"
  }
];

const schema = generateSchema.json('Customer', Customers, {
    pickPopularFormat: true
  })
```

### Outputs

If you observe the data in "DivisionCode" key some are string and 
some are date-time, without the option pickPopularFormats the format
would be date-time, with option turned on it picks the format as string
because the format "string" appears more times then date-time and string
can hold any types.

```js
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Customer Set",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "Id": {
        "type": "string",
        "minLength": 36,
        "maxLength": 36,
        "format": "uuid"
      },
      "FirstName": {
        "type": "string",
        "format": "string"
      },
      "Gender": {
        "type": "string",
        "format": "string"
      },
      "BirthDate": {
        "type": "string",
        "format": "date"
      },
      "DivisionCode": {
        "type": "string",
        "format": "string"
      },
      "NumberAndString": {
        "type": [
          "string",
          "number"
        ],
        "format": "string"
      },
      "Salary": {
        "type": "number",
        "format": "number"
      },
      "DateUpdated": {
        "type": "string",
        "format": "date-time"
      }
    },
    "required": [
      "Id",
      "FirstName",
      "Gender",
      "BirthDate",
      "DivisionCode",
      "NumberAndString",
      "Salary",
      "DateUpdated"
    ],
    "title": "Customer"
  }
}
```

## Example

Generate JSON Schema with format counts (but not with popular format)

```js
const Customers = [
  {
    Id: "8198f931-f31d-4051-8964-5efe1d804a19",
    FirstName: "Gabe",
    Gender: "Male",
    BirthDate: "2000-04-01",
    DivisionCode: "PRP",
    NumberAndString: "test",
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
    Salary: -10023.5,
    DateUpdated: "2018-01-16T23:33:01+00:00"
  },
  {
    Id: "8198f931-f31d-4051-8964-5efe1d804a19",
    FirstName: "Enu",
    Gender: "Female",
    BirthDate: "2002-04-01",
    DivisionCode: "HDW",
    NumberAndString: "one",
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
    Salary: 10023.4501,
    DateUpdated: "2018-01-16T23:33:44+00:00"
  }
];

const schema = generateSchema.json('Customer', Customers, {
    addFormatCounts: true
  })
```

### Outputs

If you observe the data in "DivisionCode" key some are string and 
some are date-time. If you set addFormatCounts it will add how many
times a particular format appears. DivisionCode will have a new output

formats: {date-time:1, string:3} meaning string appears 3 times and date-time appears 1 time.

This can be used by caller to determine the format instead of using the given
format or picking the popular format.

```js
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Customer Set",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "Id": {
        "type": "string",
        "minLength": 36,
        "maxLength": 36,
        "format": "string",
        "formats": {
          "uuid": 3,
          "string": 1
        }
      },
      "FirstName": {
        "type": "string",
        "format": "string",
        "formats": {
          "string": 4
        }
      },
      "Gender": {
        "type": "string",
        "format": "string",
        "formats": {
          "string": 4
        }
      },
      "BirthDate": {
        "type": "string",
        "format": "string",
        "formats": {
          "date": 3,
          "string": 1
        }
      },
      "DivisionCode": {
        "type": "string",
        "format": "date-time",
        "formats": {
          "string": 3,
          "date-time": 1
        }
      },
      "NumberAndString": {
        "type": [
          "string",
          "number"
        ],
        "format": "number",
        "formats": {
          "string": 3,
          "number": 1
        }
      },
      "Salary": {
        "type": "number",
        "format": "number",
        "formats": {
          "number": 4
        }
      },
      "DateUpdated": {
        "type": "string",
        "format": "date-time",
        "formats": {
          "date-time": 4
        }
      }
    },
    "required": [
      "Id",
      "FirstName",
      "Gender",
      "BirthDate",
      "DivisionCode",
      "NumberAndString",
      "Salary",
      "DateUpdated"
    ],
    "title": "Customer"
  }
}
```

## Example

Generate JSON Schema with enums and lengths

```js
const schema = generateSchema.json('Customer', Customers,{
  generateEnums: true,
  maxEnumValues: 2,
  generateLengths: true 
})
```

### Outputs (With enums and lengths)

```js
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Customer Set",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "Id": {
        "type": "string",
        "minLength": 36,
        "maxLength": 36,
        "enum": [
          "8198f931-f31d-4051-8964-5efe1d804a19",
          "abaa80cc-e0eb-4a33-8292-ec937ffe773b"
        ]
      },
      "FirstName": {
        "type": "string",
        "enum": [
          "John",
          "Cindy"
        ],
        "minLength": 4,
        "maxLength": 5
      },
      "LastName": {
        "type": "string",
        "enum": [
          "Doe",
          "Kline"
        ],
        "minLength": 3,
        "maxLength": 5
      },
      "Gender": {
        "type": "string",
        "enum": [
          "Male",
          "Female"
        ],
        "minLength": 4,
        "maxLength": 6
      },
      "BirthDate": {
        "type": "string",
        "format": "date",
        "enum": [
          "2000-04-01",
          "1974-10-25"
        ],
        "minLength": 10,
        "maxLength": 10
      },
      "DateUpdated": {
        "type": "string",
        "format": "date-time",
        "enum": [
          "2018-01-16T23:33:01+00:00",
          "2018-01-16T23:33:44+00:00"
        ],
        "minLength": 25,
        "maxLength": 25
      }
    },
    "required": [
      "Id",
      "FirstName",
      "LastName",
      "Gender",
      "BirthDate",
      "DateUpdated"
    ],
    "title": "Customer"
  }
}

```

## Methods

#### `generateSchema.json(String title, Mixed object, [Object options])`
Generates JSON Schema from an Object or Array

- title of JSON Schema
- object must be of type Object or Array
- options is optional

## Options

- `generateEnums` flag is used to add enum list to schema for string types and defaults to false
- `maxEnumValues` is used to limit the number of enum values detected and defaults to 20
- `generateLengths` flag to generate minLength and maxLength attributes based on values in json and defaults to false 
- `pickPopularFormat` flag to pick popular format if more than one format exists
- `addFormatCounts` flag to include counts by format for each key in data


[JSON Schema]: http://json-schema.org
[generate-schema]: https://www.npmjs.com/package/generate-schema