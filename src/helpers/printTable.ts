import { Color } from 'termkit'

const ANSI_RE = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g

function visibleLength(s: string): number {
  return s.replace(ANSI_RE, '').length
}

function padString(s: string, length: number): string {
  while (visibleLength(s) < length) s += ' '
  return s
}

export function printTable(array: string[][], keys: string[]): void {
  const padding: Record<number, number> = {}

  for (const [index, key] of keys.entries()) {
    if (!padding[index] || visibleLength(key) > padding[index]) padding[index] = visibleLength(key)
  }

  for (const row of array) {
    for (const [index, cell] of row.entries()) {
      if (!padding[index] || visibleLength(cell) > padding[index]) padding[index] = visibleLength(cell)
    }
  }

  if (keys.length > 0) {
    let string = ''
    for (const [index, key] of keys.entries()) {
      string += padString(key, padding[index])
      if (index !== keys.length - 1) string += '  '
    }
    console.log(Color.underline(string))
  }

  for (const row of array) {
    let string = ''
    for (const [index, cell] of row.entries()) {
      string += padString(cell ?? '', padding[index] ?? 0)
      if (index !== row.length - 1) string += '   '
    }
    console.log(string)
  }
}
