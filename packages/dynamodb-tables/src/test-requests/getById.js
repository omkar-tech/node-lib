'use strict'
const table = require('../index')
table.config({ tablePrefix: 'aplha', debug: true })

const testTable = table.create('employee')

testTable.getById('5ed3c43f-1d97-46b5-b288-651a6972d109')
.then((res) => {
  console.log('Done - ', res)
})
.catch(e => console.log('e - ', e))
