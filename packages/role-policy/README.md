# `@omkartech/role-policy`
# Role Policy

This package contains policy rules for aws auth roles.

## ROLES
Default export is a JSON object of all roles available.  

### ROLE_AWS_APP_ADMIN

String `AwsAppAdmin`

Highest level admin generally used by applications

### ROLE_APP_READONLY_ADMIN

String `AppReadOnlyAdmin`

### ROLE_EXTERNAL_CLIENT_ADMIN

String `ExternalClientAdmin`

### ROLE_EXTERNAL_CLIENT_READONLY_ADMIN

String `ExternalReadOnlyClientAdmin`

### ROLE_ANY_EMPLOYEE

String `AnyEmployee`

## Usage

Roles default export

```js
import ROLES from '@omkartech/role-policy'

if (ROLES.AWS_APP_ADMIN) {
  console.log('"AWS Application Admin" is the highest level admin')
}
```

Named exports for roles

```js
import {
  ROLE_AWS_APP_ADMIN,
  ROLE_APP_READONLY_ADMIN,
  ROLE_EXTERNAL_CLIENT_ADMIN,
  ROLE_EXTERNAL_CLIENT_READONLY_ADMIN,
  ROLE_ANY_EMPLOYEE,
} from '@Omkartech/role-policy'

if (ROLE_AWS_APP_ADMIN) {
  console.log('"ROLE_AWS_APP_ADMIN" is the highest level admin')
}

if (ROLE_ANY_EMPLOYEE) {
  console.log('"ROLE_ANY_EMPLOYEE" is for employees')
}

```
