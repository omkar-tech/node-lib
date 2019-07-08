# `@omkartech/dynamodb-tables`
---
An interface for AWS DynamoDB with helper functions


```bash
npm install --save @omkartech/dynamodb-tables
```

## Module level ##
1. config - configure the table with stage or other variables
2. client - a DynamoDB client
3. getPolicy - get an output of what policy your lambda will need to interface with dynamodb

## Table Instance ##
1. client - a DynamoDB client
2. getTableName - get the object's table name
3. scan - get all records for a table
4. getAll - alias for scan
5. getById - get a record by an Id key
6. getByKey - like getById, but allows any Key configuration to be set
7. update - update a record by calling client.update()
8. query - DynamoDB query with provided params
9. deleteById - delete a record by and Id key

# Import #
---

```javascript
// import
import table from '@omkartech/tables'
```


# config({ tablePrefix, debug }) #
---

```javascript
// import
import table from '@omkartech/tables'

// Configure table with stage
table.config({
  tablePrefix: stage, // takes care of prefixing for different stages
  debug: true // outputs dynamodb usage information as you query
})


```

# create(tableName, { primaryKey, indexName }) #
---
Create a new table instance.

Options available

1. primaryKey - defaults to `Id` if not specified
2. indexName - table index to be used with query

```javascript
// Access the root table by name. For the alpha-employee table, just user the name employee
// This will handle prefixing for alpha-employee, beta-employee, and employee on it's own
const employee = table.create('employee')

// With a specified primary key
const employee = table.create('employee', { primaryKey; 'EmployeePublicKey' })

// With a specified index key
const employee = table.create('employee', { indexName; 'EmployeePublicKey-index' })

```


# getById(id) #
---

Retrieve a record using the Id field of the table, or other named Id field

**NOTE: If item is not found, the promise will resolve successfully with a response of undefined**

```javascript
// Uses the primary key Id by default
//
employee.getById('0afdfcf4-39e8-5c21-87d0-886e485a89e5')
```


# getAll(scanParams) - Alias for scan #
---

Retrieve all the records for a table.  This handles the recursive actions needed for DynamoDB to get all records
```javascript
employee.getAll() // alias for scan
```


# getAllById(idArray) #
---

Retrieve all the records of a table from an array of Ids.  Uses DynamoDB batch get to retrieve the records.  DyanamoDB limits the result to 100 records, so if more than 100 IDs are requested, the function will make a separate request for every set of 100 IDs.


"Yo dawg, I heard you like batch requests.  So we put a batch request on your batch request so you can get all your records while getting some records"

```javascript
employee.getAllById(['1, 2, 3, 4'])
```


# updateById(id, attributes, addParams) #
---

Update a record's data by specifying it's Id and the attributes to update. Provide additional dynamo client parameters as needed

```javascript
const id = 'cefec8d2-172d-5223-bb73-e95f32321ba9'
const updateKeys = { EmailAddress: 'someemail@omkartech.com' }
const addParams = { ReturnValues: 'UPDATED_NEW' }

employee.updateById(id, updateKeys, addParams)
```


# query(params) #
---

DynamoDB query operation.  Could use more love and testing.
```javascript
employee.query(params)
```


# update(params) #
---

DynamoDB update operation.  Could use more love and testing.
```javascript
employee.update(dynamoUpdateParams)
```

# scan(params) #
---

DyanamoDB scan operation.  This handles the recursive actions needed for DynamoDB to get all records
```javascript
employee.scan(params)
```

# deleteById(id, addParams) #
---

Delete a record's data by specifying its Id. Provide additional dynamo client parameters as needed

```javascript
const id = 'cefec8d2-172d-5223-bb73-e95f32321ba9'

employee.deleteById(id)
```


## MaxLimit - special limit config property

Any batch commands such as scan or query can take a specialized `MaxLimit` property to control the amount of records pulled. This is different than the `Limit` property used by Dynamodb. MaxLimit will make recursive calls until it retrieves the `MaxLimit` value, or if it reaches the end of the table rows. 

Since `MaxLimit` is not a property allowed by Dynamodb, the property is removed from the config when the passed to the Dynamodb client. 

**Example with getAll/scan**
```js
const employee = await employeeTable.getAll({ 
  MaxLimit: 300, 
  ProjectionExpression: 'FirstName, LastName' 
})

// the employee result will be an object
{
  Items: [ ... ], // 300 employee from the database
  LastEvaluatedKey: { Id: 123 }, // Where the query ended when it reached the limit. LastEvaluatedKey can change as the table size changes.
  RowCount: 300 // Total rows return 
}
```

**Example with queryByKeys**
```js
const employee = await employeeTable.queryByKeys({
  ClientPublicKey: 'cefec8d2-172d-5223-bb73-e95f32321ba9'
}, { 
  MaxLimit: 2, 
  ProjectionExpression: 'FirstName, LastName' 
})
```
