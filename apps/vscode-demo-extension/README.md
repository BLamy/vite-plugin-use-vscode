# use-vscode-demo-extension README

This is the README for your extension "use-vscode-demo-extension". After writing up a brief description, we recommend including the following sections.

## Features

This extension includes:

1. A simple "Hello World" command that shows a message
2. A React-powered webview that demonstrates integration with VS Code

## Running the Extension

1. Run `pnpm compile-web` to build both the extension and the React webview
2. Press F5 to open a new window with your extension loaded
3. Run the command "Open React Webview" to see the React app in a webview
4. Make changes to the React code in `src/web/webview` directory
5. Run `pnpm watch-web` to automatically rebuild on changes

## Development Workflow

### Extension Development

- The extension code is located in `src/web/extension.ts`
- It's built using esbuild via the `esbuild.js` script

### React Webview Development

- The React app is located in `src/web/webview/`
- It's built using Vite, which provides fast HMR during development
- Run `pnpm dev-webview` to start the Vite dev server for isolated React development
- The webview integrates with VS Code's theming via CSS variables

## Building for Production

Run `pnpm package-web` to create optimized production builds of both the extension and React webview.

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Working with Markdown

You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
