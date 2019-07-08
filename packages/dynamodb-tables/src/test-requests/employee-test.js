'use strict'
const chalk = require('chalk')
const table = require('../index')
table.config({ tablePrefix: 'alpha', debug: true })

const employeeTable = table.create('employee', { indexName: 'EmployeePublicKey-index' })

employeeTable.query({
  IndexName: 'DepartmentPublicKey-index',
  FilterExpression: 'IsDeleted = :isDeleted AND IsTestUser <> :true',
  KeyConditionExpression: '#DepartmentPublickKey = :DepartmentPublicKey',
  ExpressionAttributeValues: {
    ':isDeleted': true,
    ':true': true,
    ':DepartmentPublicKey': '895a62f5-3a37-4033-be5d-84cde71c4abd'
  },
  ExpressionAttributeNames: {
    '#DepartmentPublicKey': 'ClientPublicKey'
  }
})
.then(res => {
  console.log(res.length)
  console.log(res)
})
