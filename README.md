# Deplace

Save and jump to directory shortcuts in your terminal. Open shortcuts and groups in new windows or tabs, with optional scripts that run automatically on open.

Supports macOS, Linux, and Windows.

## Installation

```sh
npm install -g deplace
```

## Usage

```sh
deplace [shortcuts...] [options]
```

Open a saved shortcut in the current window, or use `-n` to open in a new window.

```sh
deplace myproject
deplace myproject -n
```

## Commands

### `add [dirs...]`

Add one or more directories as shortcuts. Defaults to the current directory.

```sh
deplace add                        # adds current directory
deplace add ~/projects/myapp       # adds a specific path
deplace add -n myapp               # adds with a custom name
deplace add -a ~/projects          # adds all subdirectories
```

| Option | Description |
|--------|-------------|
| `-a, --all` | Add all subdirectories within the provided path |
| `-n, --name <name>` | Use a custom name instead of the directory basename |

### `remove [vars...]`

Remove shortcuts by name or directory.

```sh
deplace remove myapp
deplace remove ~/projects/myapp -a  # remove all shortcuts within a path
```

| Option | Description |
|--------|-------------|
| `-a, --all` | Remove all shortcuts within the provided directories |

### `list [shortcut]`

List all shortcuts, or show details for a specific one.

```sh
deplace list
deplace list myapp
deplace list -d ~/projects         # filter to those within a directory
deplace list -v                    # show group memberships
```

| Option | Description |
|--------|-------------|
| `-d, --dir <dir>` | Filter to shortcuts within a directory |
| `-v, --verbose` | Show group and shortcut relationships |

### `clean`

Remove all shortcuts whose directories no longer exist.

```sh
deplace clean
```

### `group <name> [shortcuts...]`

Assign shortcuts to a named group. Opening a group opens all of its shortcuts.

```sh
deplace group myteam api frontend worker
deplace group myteam api -r          # replace existing group members
```

| Option | Description |
|--------|-------------|
| `-r, --replace` | Replace existing group shortcuts instead of appending |

### `script [scripts...]`

Attach a shell command to a shortcut or group. The script runs automatically when the shortcut or group is opened.

```sh
deplace myapp script "npm run dev"
deplace myteam script "git status" -r   # replace existing scripts
```

| Option | Description |
|--------|-------------|
| `-r, --replace` | Replace existing scripts instead of appending |

## Data

Shortcuts, groups, and scripts are stored in a SQLite database at `~/.config/deplace/data.db`.

## License

ISC
