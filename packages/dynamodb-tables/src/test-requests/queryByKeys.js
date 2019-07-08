'use strict'
const table = require('../index')
table.config({ tablePrefix: 'alpha', debug: true })

const employeeTable = table.create('employee', { indexName: 'EmployeePublicKey-index' })
employeeTable.queryByKeys({
  EmployeePublicKey: 'bdfeb7d1-062d-4123-aa73-d84e32321ba9'
})
.then((res) => {
  console.log('Done - ', res)
})
.catch(e => console.log('e - ', e))
