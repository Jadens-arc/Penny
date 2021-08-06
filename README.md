# Penny

> Simple, Secure, yes

## Usage

Download executable from releases (currently only available for windows)

## Development Usage

After cloning repo (and navigating to directory) run

```bash
npm i
```

And then run...

```bash
npm test
```

To compile application to an executable run

```bash
npm run dist
```

... to start the application

Compiled versions for Windows and Linux coming soon

## Keyboard Shortcuts

| Shortcut     | Function             |
| ------------ | -------------------- |
| ctrl+w       | Close App            |
| ctrl+r       | Lock Session         |
| ctrl+n       | New Note             |
| ctrl+shift+n | New Tab              |
| ctrl+shift+a | Toggle Always on Top |
| ctrl+h       | Show help Screen     |
| ctrl+d       | Insert current date  |
| ctrl+o       | Open new wallet      |

## Background Information

This app was writing using Node.js and Electron for the UI, AES for encrypting notes, and MD5 for hashing passwords.

This app was largely inspired by [Sabrina Cruz from Answer in Progress](https://youtu.be/semHAO-AEn0)

Yes I am aware that this removes a lot of the creative element of bullet journaling but in exchange it provides one of the safest places to introspect. More create features are in the pipeline and feel free to branch this repo and make your own creative additions for your life.
