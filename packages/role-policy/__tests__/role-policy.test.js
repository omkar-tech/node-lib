import { assert } from 'chai'
import ROLES, {
  ROLE_AWS_APP_ADMIN,
  ROLE_APP_READONLY_ADMIN,
  ROLE_EXTERNAL_CLIENT_ADMIN,
  ROLE_EXTERNAL_CLIENT_READONLY_ADMIN,
  ROLE_ANY_EMPLOYEE,
} from '../src/role-policy'

describe('Roles exports.', () => {
  it('default export', () => {
    assert.isObject(ROLES, 'Roles export is not an object')
    assert(Object.keys(ROLES).length === 5, 'ROLES object should have 5 keys')
  })

  it('ROLE_AWS_APP_ADMIN export', () => {
    assert.isString(ROLE_AWS_APP_ADMIN, 'ROLE_AWS_APP_ADMIN should be a string')
  })

  it('ROLE_APP_READONLY_ADMIN export', () => {
    assert.isString(ROLE_APP_READONLY_ADMIN, 'ROLE_APP_READONLY_ADMIN should be a string')
  })

  it('ROLE_EXTERNAL_CLIENT_ADMIN export', () => {
    assert.isString(ROLE_EXTERNAL_CLIENT_ADMIN, 'ROLE_EXTERNAL_CLIENT_ADMIN should be a string')
  })

  it('ROLE_EXTERNAL_CLIENT_READONLY_ADMIN export', () => {
    assert.isString(ROLE_EXTERNAL_CLIENT_READONLY_ADMIN, 'ROLE_EXTERNAL_CLIENT_READONLY_ADMIN should be a string')
  })

  it('ROLE_ANY_EMPLOYEE export', () => {
    assert.isString(ROLE_ANY_EMPLOYEE, 'ROLE_ANY_EMPLOYEE should be a string')
  })
})


describe('Roles should be tested.', () => {
  describe('Aws App Admin', () => {
    it('role should exist', () => {
      assert(ROLE_AWS_APP_ADMIN === 'AwsAppAdmin', 'role not found')
    })

    it('role be a string', () => {
      assert.isString(ROLE_AWS_APP_ADMIN, 'not a string')
    })
  })

  describe('App Read Only Admin', () => {
    it('role should exist', () => {
      assert(ROLE_APP_READONLY_ADMIN === 'AppReadOnlyAdmin', 'role not found')
    })

    it('role be a string', () => {
      assert.isString(ROLE_APP_READONLY_ADMIN, 'not a string')
    })
  })

  describe('External Client Admin', () => {
    it('role should exist', () => {
      assert(ROLE_EXTERNAL_CLIENT_ADMIN === 'ExternalClientAdmin', 'role not found')
    })

    it('role be a string', () => {
      assert.isString(ROLE_EXTERNAL_CLIENT_ADMIN, 'not a string')
    })
  })

  describe('External Client Read Only Admin', () => {
    it('role should exist', () => {
      assert(ROLE_EXTERNAL_CLIENT_READONLY_ADMIN === 'ExternalReadOnlyClientAdmin', 'role not found')
    })

    it('role be a string', () => {
      assert.isString(ROLE_EXTERNAL_CLIENT_READONLY_ADMIN, 'not a string')
    })
  })

  describe('Any Employee Role', () => {
    it('role should exist', () => {
      assert(ROLE_ANY_EMPLOYEE === 'AnyEmployee', 'role not found')
    })

    it('role be a string', () => {
      assert.isString(ROLE_ANY_EMPLOYEE, 'not a string')
    })
  })
})
