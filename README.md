
# tiny-logger
[![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@deverlabs/tiny-logger.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@deverlabs/tiny-logger
Small JS utility to create colored logs for both terminal and browser console

![alt text](https://xd3coder.github.io/image-host/tiny-logger/output.jpg "Output")

## Installation

### Yarn
```bash
yarn add @deverlabs/tiny-logger
```

### NPM
```bash
npm install @deverlabs/tiny-logger
```

## Usage

#### Print messages
```jsx
import { Logger } from '@deverlabs/tiny-logger';
const logger = new Logger('/api/user')

logger.info('User successfuly connected:', { id: 2 })
```
##### Result
```
[10:25:26.574] INFO [/api/user]: User successfuly connected: { id: 2 }
```

#### Measure execution time
```jsx
import { Logger } from '@deverlabs/tiny-logger';
const logger = new Logger('/api/user')

logger.start()
...
logger.stop()
```
##### Result
```
[14:35:43.945] TIME [/api/user]: Start timer [14:35:43.945]
[14:35:43.949] TIME [/api/user]: Duration +4ms
```

## API
#### new Logger(label: string)
Instanciate a new TinyLogger object with `label` to identify the current file for easier debugging
#### logger.info
Print informative message
#### logger.error
Print error message
#### logger.success
Print success message
#### logger.warning
Print warning message
#### logger.debug
Print debug message
> :information_source: This will works only when proces.env.NODE_ENV is set to `development`
#### logger.start
Start a timer to measure execution time in your code
#### logger.stop
Stop the timer and output the time elapsed in milliseconds
