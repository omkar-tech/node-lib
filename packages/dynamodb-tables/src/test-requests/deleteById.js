const table = require('../index')
table.config({ tablePrefix: 'aplha', debug: true })

const empAttributesTable = table.create('employee', { indexName: 'EmployeeId-index' })

empAttributesTable.deleteById('f63abd0e-4e74-463d-b5c6-8da6d005c030')
.then(response => console.log(response))
