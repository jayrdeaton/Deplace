import { select } from 'termkit'

type Shell = 'zsh' | 'bash' | 'fish' | 'powershell'

const SHELLS = ['zsh', 'bash', 'fish', 'powershell'] as const

const SUBCMDS = ['add', 'remove', 'list', 'clean', 'group', 'script', 'init', 'help']

const scripts: Record<Shell, string> = {
  zsh: `# deplace shell integration
dp() {
  case "$1" in
    ${SUBCMDS.join('|')}|-*)
      deplace "$@" ;;
    *)
      local dest
      dest=$(deplace --print "$@") && cd "$dest" ;;
  esac
}`,
  bash: `# deplace shell integration
dp() {
  case "$1" in
    ${SUBCMDS.join('|')}|-*)
      deplace "$@" ;;
    *)
      local dest
      dest=$(deplace --print "$@") && cd "$dest" ;;
  esac
}`,
  fish: `# deplace shell integration
function dp
  set subcmds ${SUBCMDS.join(' ')}
  if contains -- $argv[1] $subcmds; or string match -q -- '-*' $argv[1]
    deplace $argv
  else
    set dest (deplace --print $argv)
    and cd $dest
  end
end`,
  powershell: `# deplace shell integration
function dp {
  $subcmds = @('${SUBCMDS.join("','")}')
  if ($subcmds -contains $args[0] -or $args[0] -like '-*') {
    deplace @args
  } else {
    $dest = deplace --print @args
    if ($LASTEXITCODE -eq 0) { Set-Location $dest }
  }
}`
}

function detect(): Shell | null {
  const shell = process.env['SHELL']
  if (shell) {
    const name = shell.split('/').pop()?.toLowerCase()
    if (name && SHELLS.includes(name as Shell)) return name as Shell
  }
  if (process.env['PSModulePath']) return 'powershell'
  return null
}

interface InitOptions {
  shell?: string
}

export default async ({ shell }: InitOptions): Promise<void> => {
  let resolved = (shell as Shell) ?? detect()

  if (!resolved) {
    const result = await select(
      'Select your shell',
      SHELLS.map((s) => ({ label: s }))
    )
    if (!result) return
    resolved = result.label as Shell
  }

  if (!SHELLS.includes(resolved)) {
    throw new Error(`Unsupported shell: ${resolved}. Supported: ${SHELLS.join(', ')}`)
  }

  if (process.stdout.isTTY) {
    const rcFiles: Record<Shell, string> = {
      zsh: '~/.zprofile (or ~/.zshrc)',
      bash: '~/.bashrc',
      fish: '~/.config/fish/config.fish',
      powershell: '~/.profile'
    }
    process.stdout.write(`# Add this to your ${rcFiles[resolved]}:\n#   eval "$(deplace init ${resolved})"\n\n`)
  }
  process.stdout.write(scripts[resolved] + '\n')
}
