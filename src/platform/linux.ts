import { spawn, spawnSync } from 'node:child_process'

type BuildArgs = (dir: string, command: string | null, newWindow: boolean) => string[]

interface TerminalDef {
  cmd: string
  buildArgs: BuildArgs
}

const TERMINALS: TerminalDef[] = [
  {
    cmd: 'gnome-terminal',
    buildArgs: (dir, command, newWindow) => {
      const mode = newWindow ? '--window' : '--tab'
      return command ? [mode, `--working-directory=${dir}`, '--', 'bash', '-c', `${command}; exec bash`] : [mode, `--working-directory=${dir}`]
    }
  },
  {
    cmd: 'konsole',
    buildArgs: (dir, command, _newWindow) => (command ? ['--workdir', dir, '-e', 'bash', '-c', `${command}; exec bash`] : ['--workdir', dir])
  },
  {
    cmd: 'xfce4-terminal',
    buildArgs: (dir, command, newWindow) => {
      const mode = newWindow ? '--window' : '--tab'
      return command ? [mode, `--working-directory=${dir}`, '--command', `bash -c "${command}; exec bash"`] : [mode, `--working-directory=${dir}`]
    }
  },
  {
    cmd: 'mate-terminal',
    buildArgs: (dir, command, newWindow) => {
      const mode = newWindow ? '--window' : '--tab'
      return command ? [mode, `--working-directory=${dir}`, '--', 'bash', '-c', `${command}; exec bash`] : [mode, `--working-directory=${dir}`]
    }
  },
  {
    cmd: 'tilix',
    buildArgs: (dir, command, _newWindow) => (command ? ['--working-directory', dir, '-e', `bash -c "${command}; exec bash"`] : ['--working-directory', dir])
  },
  {
    cmd: 'alacritty',
    buildArgs: (dir, command, _newWindow) => (command ? ['--working-directory', dir, '-e', 'bash', '-c', `${command}; exec bash`] : ['--working-directory', dir])
  },
  {
    cmd: 'kitty',
    buildArgs: (dir, command, _newWindow) => (command ? ['--directory', dir, 'bash', '-c', `${command}; exec bash`] : ['--directory', dir])
  },
  {
    cmd: 'xterm',
    buildArgs: (dir, command, _newWindow) => {
      const cmd = command ? `cd "${dir}" && ${command}; exec bash` : `cd "${dir}"; exec bash`
      return ['-e', 'bash', '-c', cmd]
    }
  }
]

function detect(): TerminalDef {
  const env = process.env['TERMINAL']
  if (env) {
    const match = TERMINALS.find((t) => t.cmd === env)
    if (match) return match
  }

  for (const terminal of TERMINALS) {
    if (spawnSync('which', [terminal.cmd], { stdio: 'ignore' }).status === 0) return terminal
  }

  throw new Error('No supported terminal emulator found. Set $TERMINAL or install one of: ' + TERMINALS.map((t) => t.cmd).join(', '))
}

export function openTerminal(dir: string, newWindow: boolean, scripts: string[]): void {
  const terminal = detect()
  const command = scripts.length > 0 ? scripts.join(' && ') : null
  const child = spawn(terminal.cmd, terminal.buildArgs(dir, command, newWindow), {
    detached: true,
    stdio: 'ignore'
  })
  child.unref()
}
