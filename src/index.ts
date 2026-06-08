import { printError } from './helpers'
import program from './program'

const run = async (args: string[]): Promise<void> => {
  if (args.length === 2) args.push('help')
  try {
    await program.parse(args)
  } catch (err) {
    printError(err as Error)
  }
}

run(process.argv)
