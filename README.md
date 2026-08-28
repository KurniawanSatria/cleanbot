# Scheduler

Automated file maintenance for Windows. Sorts downloads, cleans temp folders, and deletes old files.

## Features

- **Auto Sort** — Moves files in Downloads to subfolders (Images, Videos, Documents, etc.) by extension
- **Clean Temp** — Removes contents of configured temp directories
- **Delete Old Files** — Deletes files older than 30 days in Downloads (recursive)
- **Discord Webhook** — Optional notifications via Components V2
- **File Logging** — All actions logged to `scheduler.log`

## Setup

Requires [Node.js](https://nodejs.org/).

```
git clone <repo>
cd Scheduler
```

No dependencies needed — stdlib only.

## Configuration

Edit `config.json`:

| Key | Description |
|---|---|
| `downloads` | Path to Downloads folder |
| `tempDirs` | Array of temp folder paths to clean |
| `maxAgeDays` | Delete files older than N days |
| `discordWebhook` | Discord webhook URL (empty = disabled) |
| `logFile` | Log file name |
| `sortRules` | Extension-to-folder mapping |

## Usage

### Manual run

```
node index.js
```

### Windows Task Scheduler (recommended)

```
schtasks /create /tn "Scheduler - Auto Clean & Sort" /tr "cmd /c cd /d <project-path> && node index.js" /sc daily /st 00:00 /rl highest /f
```

## Structure

```
Scheduler/
  config.json       — paths, rules, webhook
  index.js          — entry point
  scheduler.log     — auto-generated log
  src/
    logger.js       — file log + Discord webhook
    sorter.js       — sort by extension
    cleaner.js      — clean temp + delete old files
```

## License

ISC
