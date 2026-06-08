import { openTerminal as linuxOpen } from './linux'
import { openTerminal as macOpen } from './mac'
import { openTerminal as windowsOpen } from './windows'

type OpenFn = (dir: string, newWindow: boolean, scripts: string[]) => void

const platforms: Partial<Record<NodeJS.Platform, OpenFn>> = {
  darwin: macOpen,
  linux: linuxOpen,
  win32: windowsOpen
}

const impl = platforms[process.platform]
if (!impl) throw new Error(`Unsupported platform: ${process.platform}`)

export const openTerminal: OpenFn = impl
