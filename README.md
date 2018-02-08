# Deplace

A shortcut command line utility for Mac Terminal

## Getting Started

This is how you start shortcutting through your terminal

### Installing

Add this package globally to your machine

```
npm install -g deplace
```

### Using

Add your first deplace shortcut

```
deplace add
```

Or add it with a specified path

```
deplace add ./example
```

Or add it with a specified path and name

```
deplace add ./example myname
```

Now you can navigate there easily

```
deplace myname
```

View your stored shortcuts

```
deplace list
```

You can also narrow your list by providing a parent directory

```
deplace list ./example
```

Remove stored shortcuts

```
deplace remove myname
deplace remove ./example
```

Remove all shortcuts that no longer exists

```
deplace clean
```

View the usage guide in terminal

```
deplace help
```

Stay tuned for more

## Authors

* **Jay Deaton** - [Github](https://github.com/jayrdeaton)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
