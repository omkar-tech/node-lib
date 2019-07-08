const table = require('../index')
table.config({ tablePrefix: 'alpha', debug: true })

const employeeTable = table.create('employee')

employeeTable.updateById('5ed3c43f-1d97-46b5-b288-651a6972d109', {
  EmailAddress: 'ssssother@omkartech.com',
  FirstName: 'Raj'
}, { ReturnValues: 'UPDATED_NEW' })
.then(response => console.log(response))
