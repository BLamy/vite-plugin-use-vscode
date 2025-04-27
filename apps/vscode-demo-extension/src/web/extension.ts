// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "use-vscode-demo-extension" is now active in the web extension host!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('use-vscode-demo-extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from use-vscode-demo-extension in a web extension host!');
	});

	// Register a command to open the React webview panel
	const openWebviewDisposable = vscode.commands.registerCommand('use-vscode-demo-extension.openReactWebview', () => {
		ReactWebviewPanel.createOrShow(context.extensionUri);
	});

	context.subscriptions.push(disposable, openWebviewDisposable);
}

/**
 * Manages React webview panels
 */
class ReactWebviewPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: ReactWebviewPanel | undefined;

	private static readonly viewType = 'reactWebview';
	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (ReactWebviewPanel.currentPanel) {
			ReactWebviewPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ReactWebviewPanel.viewType,
			'React Webview',
			column || vscode.ViewColumn.One,
			{
				// Enable JavaScript in the webview
				enableScripts: true,
				// Restrict the webview to only load content from our extension's directory
				localResourceRoots: [
					vscode.Uri.joinPath(extensionUri, 'dist/webview')
				],
				retainContextWhenHidden: true,
			}
		);

		ReactWebviewPanel.currentPanel = new ReactWebviewPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update();

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			async (message) => {
				const { type, id, data } = message;

				try {
					let result;

					switch (type) {
						case 'showInformationMessage':
							result = await vscode.window.showInformationMessage(
								data.message,
								'Yes',
								'No'
							);
							break;
						case 'listWorkspaceFiles':
							const files = await vscode.workspace.findFiles('**/*');
							result = files.map(file => file.fsPath);
							break;
						case 'openTextDocument':
							try {
								const doc = await vscode.workspace.openTextDocument(data.path);
								await vscode.window.showTextDocument(doc);
								result = `Opened ${data.path}`;
							} catch (err) {
								throw new Error(`Failed to open ${data.path}: ${err instanceof Error ? err.message : String(err)}`);
							}
							break;
						case 'getCurrentTheme':
							const theme = vscode.window.activeColorTheme;
							result = {
								kind: theme.kind.toString(),
								name: theme.kind === vscode.ColorThemeKind.Dark ? 'Dark' : 
									  theme.kind === vscode.ColorThemeKind.Light ? 'Light' : 
									  theme.kind === vscode.ColorThemeKind.HighContrast ? 'High Contrast' : 
									  'High Contrast Light'
							};
							break;
						default:
							throw new Error(`Unknown message type: ${type}`);
					}

					this._panel.webview.postMessage({ id, data: result });
				} catch (error) {
					// Send error back to webview
					this._panel.webview.postMessage({
						id,
						error: error instanceof Error ? error.message : String(error)
					});
				}
			},
			null,
			this._disposables
		);

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		ReactWebviewPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
		
		this._panel.title = "VS Code API Bridge Demo";
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to the webview's output directory
		const webviewPath = vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview');
		
		// Base URI to use for resources
		const baseUri = webview.asWebviewUri(webviewPath).toString();
		
		// Create the HTML from scratch for the webview
		const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VS Code API Bridge Demo</title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource}; font-src ${webview.cspSource};">
    <base href="${baseUri}/">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${webview.asWebviewUri(vscode.Uri.joinPath(webviewPath, 'assets', 'webview.js'))}"></script>
  </body>
</html>`;

		return html;
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
