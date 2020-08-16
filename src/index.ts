import style, { CSPair } from 'ansi-styles'
import { stringify } from 'flatted'

const types = Object.freeze({
  error: 'ERROR',
  test: 'TEST',
  debug: 'DEBUG',
  info: 'INFO',
  success: 'SUCCS',
  warning: 'WARN',
  time: 'TIME'
})

enum Colors {
  info = 'info',
  error = 'error',
  success = 'success',
  normal = 'normal',
  warning = 'warning',
  debug = 'debug',
  time = 'time'
}

const ColorsTerminal: Record<string, CSPair> = {
  info: style.cyan,
  error: style.red,
  success: style.green,
  normal: style.grey,
  warning: style.yellowBright,
  debug: style.magenta,
  time: style.yellow
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

const messageFormatter = (params: inputMessage) => {
  const m = params.map((msg) => {
    if (typeof msg === 'object') {
      return stringify(msg, null, 4)
    }
    return msg
  })
  return m.join('')
}

type inputMessage = Array<unknown>

interface Formatter {
  input: unknown
  typeLabel: string
  color?: Colors
}

type MessageFormatter = (
  arg0: Formatter
) => { text: Array<string>; colors: Array<string> }

interface Logger {
  debug: (...args: unknown[]) => void
  warning: (...args: unknown[]) => void
  success: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  start: () => void
  stop: () => void
}
export function Logger(this: Logger, label: string): void {
  const appname: string = label

  let starter: Date

  const formatMessage = ({
    input,
    typeLabel,
    color = Colors.normal
  }: Formatter) => {
    const assignColor = (
      text: typeof input | typeof typeLabel,
      override?: CSPair
    ): typeof text => {
      if (typeof window === 'undefined') {
        return `${
          override ? override.open : ColorsTerminal[color].open
        }${text}${override ? override.close : ColorsTerminal[color].close}`
      } else {
        return text
      }
    }
    const texts = [
      `${getFormattedDate()}`,
      `${assignColor(typeLabel)}`,
      `${assignColor(`[${appname}]:`, ColorsTerminal[Colors.normal])}`,
      `${assignColor(input)}`
    ]
    const colors = [
      'black',
      ColorsBrowser[color],
      'black',
      ColorsBrowser[color]
    ]
    return {
      text: texts,
      colors: colors
    }
  }

  const returnConsole = ({
    text,
    colors
  }: ReturnType<MessageFormatter>): void =>
    console.log(
      text.map((text) => '%c' + text).join(' '),
      ...colors.map((color) => 'color: ' + color)
    )

  this.debug = (...message) => {
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NODE_ENV !== 'dev'
    ) {
      return
    }

    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.debug,
      color: Colors.debug
    })
    return returnConsole(formatted)
  }

  this.warning = (...message) => {
    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.warning,
      color: Colors.warning
    })
    return returnConsole(formatted)
  }
  this.info = (...message) => {
    const msg = messageFormatter(message)
    const formatted = formatMessage({
      input: msg,
      typeLabel: types.info,
      color: Colors.info
    })
    return returnConsole(formatted)
  }
  this.error = (...message) => {
    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.error,
      color: Colors.error
    })
    return returnConsole(formatted)
  }

  this.success = (...message) => {
    const msg = messageFormatter(message)

    const formatted = formatMessage({
      input: msg,
      typeLabel: types.success,
      color: Colors.success
    })
    return returnConsole(formatted)
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
