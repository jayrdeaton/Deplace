import { execSync } from 'node:child_process'

function run(script: string, newWindow: boolean): void {
  const target = newWindow ? '' : 'in window 1'
  execSync(`osascript -e 'tell application "Terminal" to do script "${script}" ${target}'`)
}

function escapePath(dir: string): string {
  return dir
    .split('/')
    .map((part) => (part.includes(' ') ? `\\"${part}\\"` : part))
    .join('/')
}

export function openTerminal(dir: string, newWindow: boolean, scripts: string[]): void {
  run(`cd ${escapePath(dir)}`, newWindow)
  for (const script of scripts) run(script, false)
}
