import { spawn, spawnSync } from 'node:child_process'

function hasWindowsTerminal(): boolean {
  return spawnSync('where', ['wt'], { stdio: 'ignore', shell: true }).status === 0
}

export function openTerminal(dir: string, newWindow: boolean, scripts: string[]): void {
  const command = scripts.length > 0 ? scripts.join(' && ') : null

  if (hasWindowsTerminal()) {
    const args: string[] = newWindow ? ['-w', 'new', '-d', dir] : ['-d', dir]
    if (command) args.push('cmd', '/K', command)
    const child = spawn('wt', args, { detached: true, stdio: 'ignore', shell: true })
    child.unref()
  } else {
    const startCmd = command ? `start "" /D "${dir}" cmd /K "${command}"` : `start "" /D "${dir}" cmd`
    const child = spawn('cmd', ['/C', startCmd], { detached: true, stdio: 'ignore', shell: true })
    child.unref()
  }
}
