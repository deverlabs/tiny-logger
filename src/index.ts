const stringify = require('json-stringify-safe')

const types = Object.freeze({
  error: 'ERROR',
  test: 'TEST',
  debug: 'DEBUG',
  info: 'INFO',
  success: 'SUCCS',
  log: 'LOG',
  warn: 'WARN',
  time: 'TIME'
})

enum Colors {
  info = 'info',
  error = 'error',
  success = 'success',
  normal = 'normal',
  warn = 'warn',
  debug = 'debug',
  time = 'time'
}

const ColorsTerminal: Record<string, string> = {
  info: '\u001b[36;1m',
  error: '\u001b[31;1m',
  success: '\u001b[32;1m',
  normal:'\u001b[0m',
  warn: '\u001b[33;1m',
  debug: '\u001b[35;1m',
  time: '\u001b[33m',
}

const ColorsBrowser: Record<string, string> = {
  info: '#12d9d9',
  error: '#EE0000',
  success: '#00B300',
  normal: '#333333',
  warning: '#ff9000',
  debug: '#cc00cc',
  time: '#7c2020'
}

const getFormattedDate = (date = new Date()): string => {
  const d = new Date(date.valueOf() + date.getTimezoneOffset() * 60000)
  const currentHours = ('0' + d.getHours()).slice(-2)
  const currentMinutes = ('0' + d.getMinutes()).slice(-2)
  const currentSeconds = ('0' + d.getSeconds()).slice(-2)
  const currentMs = date.getMilliseconds()

  return (
      '[' +
      currentHours +
      ':' +
      currentMinutes +
      ':' +
      currentSeconds +
      '.' +
      currentMs +
      ']'
  )
}

const isWeb =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.product !== 'ReactNative'

const isRN = navigator.product === 'ReactNative'

const messageFormatter = (params: inputMessage) => {
  const m = params.map((msg) => {
    if (typeof msg === 'object') {
      return stringify(msg, null, 2)
    }
    return msg
  })
  return m.join('')
}

type inputMessage = unknown[]

interface Formatter {
  input: unknown
  typeLabel: string
  color?: Colors
}

type MessageFormatter = (
    arg0: Formatter
) => { text: string[]; colors: string[] }

interface ILogger {
  debug: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  success: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  log: (...args: unknown[]) => void
  start: () => void
  stop: () => void
}
export function Logger(this: ILogger, label: string): void {
  const appname: string = label

  let starter: Date

  const formatMessage = ({
                           input,
                           typeLabel,
                           color = Colors.normal
                         }: Formatter) => {

    const assignColor = (
        text: typeof input | typeof typeLabel,
        override?: string
    ): typeof text => {
      if (!isWeb) {
        return `${
            override ? override : ColorsTerminal[color]
        }${text}${ColorsTerminal[Colors.normal]}`
      } else {
        return text
      }
    }

    const texts = [
      `${assignColor(typeLabel)}`,
      `${assignColor(`[${appname}]:`)}`,
      `${assignColor(input, ColorsTerminal[Colors.normal])}`
    ]

    !isRN && texts.unshift(`${getFormattedDate()}`)

    const colors = [
      'black',
      ColorsBrowser[color],
      'black',
      ColorsBrowser[color]
    ]
    return {
      text: texts,
      colors
    }
  }

  const returnConsole = (
      { text, colors }: ReturnType<MessageFormatter>,
      console_type: string = 'log'
  ): void => {
    if (isWeb) {
      // @ts-ignore
      console[console_type](
          text.map((text) => '%c' + text).join(' '),
          ...colors.map((color) => 'color: ' + color)
      )
    } else {
      // @ts-ignore
      console[console_type](text.map((text) => text).join(' '))
    }
  }

  this.debug = (...message) => {

    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.debug,
      color: Colors.debug
    })
    return returnConsole(formatted, 'debug')
  }

  this.warn = (...message) => {
    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.warn,
      color: Colors.warn
    })
    return returnConsole(formatted, 'warn')
  }

  this.log = (...message) => {
    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.log,
      color: Colors.normal
    })
    return returnConsole(formatted, 'log')
  }

  this.info = (...message) => {
    const msg = messageFormatter(message)
    const formatted = formatMessage({
      input: msg,
      typeLabel: types.info,
      color: Colors.info
    })
    return returnConsole(formatted, 'info')
  }
  this.error = (...message) => {
    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.error,
      color: Colors.error
    })
    return returnConsole(formatted, 'error')
  }

  this.success = (...message) => {
    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.success,
      color: Colors.success
    })
    return returnConsole(formatted, 'log')
  }

  this.start = () => {
    starter = new Date()

    const formatted = formatMessage({
      input: 'Start timer ' + getFormattedDate(starter),
      typeLabel: types.time,
      color: Colors.time
    })
    return returnConsole(formatted)
  }

  this.stop = () => {
    const duration = new Date().getTime() - starter.getTime()

    const formatted = formatMessage({
      input: 'Duration +' + duration + 'ms',
      typeLabel: types.time,
      color: Colors.time
    })
    return returnConsole(formatted)
  }
}
