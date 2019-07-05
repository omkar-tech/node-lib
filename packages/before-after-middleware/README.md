Before After Middleware
=========

Allows functionality to be inserted before the lambda is called and after of warewolf stack.   Handles default error handling in after.  Before also adds a flag to tell lambda to stop running any threads when after is called.

## Installation

```bash
npm install @omkartech/before-after-middleware
```

## Usage

```js
import ware from 'warewolf';
import { before, after } from '@omkartech/before-after-middleware';

export const get = ware(
  before,
  async (event) => {
    event.result = { message: 'Hello World' };
  },
  after,
);
```

## Tests

  `npm test`

