# TermAssist CLI

A privacy-first terminal assistant that maps natural language to exact bash commands.

## Features

- ✅ **100% Offline** - Works without internet after installation
- ✅ **100% Private** - Your commands never leave your computer
- ✅ **Super Fast** - Results in under 50 milliseconds
- ✅ **No API Keys** - No signup required
- ✅ **Small Size** - Only ~10MB

## Installation

```bash
npm install -g @manoj-ruler/termassist
```

## Usage

### Interactive Mode
```bash
termassist
```

### Quick Search
```bash
termassist "find all python files"
```

### Using ?? Shortcut (Optional)
Add to your shell profile:
```bash
# Mac/Linux (~/.zshrc or ~/.bashrc)
function ?? { termassist "$@" }

# Windows ($PROFILE in PowerShell)
function ?? { termassist @args }
```

Then use:
```bash
?? find all python files
```

## Examples

```bash
termassist "find large files"
termassist "check disk usage"
termassist "list running processes"
termassist "search for text in files"
termassist "compress a folder"
```

## Dashboard & Sync

Connect to the web dashboard for:
- 📊 Command history
- 📝 Custom snippets
- 📈 Usage analytics
- 🔄 Cloud sync

1. Create account at https://termassist.vercel.app
2. Generate API token from Dashboard → Settings
3. Add token to `~/.termassist/config.json`

## Documentation

Full documentation: https://termassist.vercel.app/blog

## License

MIT License - see LICENSE file

## Author

Manoj Gaddam
