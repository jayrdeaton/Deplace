import { Color } from 'termkit'

export function printError(error: Error): void {
  console.log(`${Color.red(`${error.name}:`)} ${error.message}`)
}
