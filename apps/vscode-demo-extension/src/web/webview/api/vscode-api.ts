import * as vscode from 'vscode';


interface VSCodeTheme {
  kind: string;
  name: string;
}

// VS Code API implementation that uses the "use vscode" directive
// The directive is transformed by vite-plugin-use-vscode at build time
export class VSCodeAPI {
  /**
   * Shows an information message in VS Code
   */
  static async showInformationMessage(message: string): Promise<string | undefined> {
    "use vscode";
    // This code will be transformed to use message passing by the plugin
    const result = await vscode.window.showInformationMessage(
      message,
      'Yes', 'No'
    );
    return result;
  }

  /**
   * Lists files in the workspace
   */
  static async listWorkspaceFiles(): Promise<string[]> {
    "use vscode";
    // This code will be transformed to use message passing by the plugin
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return ["No workspace folder open"];
    }

    const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**', 100);
    return files.map(file => vscode.workspace.asRelativePath(file));
  }

  /**
   * Opens a text document
   */
  static async openTextDocument(path: string): Promise<string> {
    "use vscode";
    // This code will be transformed to use message passing by the plugin
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        throw new Error('No workspace folders open');
      }
      
      let uri;
      if (path) {
        uri = vscode.Uri.joinPath(workspaceFolders[0].uri, path);
      } else {
        const files = await vscode.workspace.findFiles('**/*.{ts,js,json}', '**/node_modules/**', 1);
        if (files.length === 0) {
          throw new Error('No suitable files found');
        }
        uri = files[0];
      }
      
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc);
      return vscode.workspace.asRelativePath(uri);
    } catch (error) {
      throw new Error(`Failed to open document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Gets the current VS Code theme info
   */
  static async getCurrentTheme(): Promise<VSCodeTheme> {
    "use vscode";
    // This code will be transformed to use message passing by the plugin
    const theme = vscode.window.activeColorTheme;
    const name = vscode.workspace.getConfiguration('workbench').get('colorTheme', '');
    
    let kindName: string;
    if (theme) {
      switch (theme.kind) {
        case 1: // ColorThemeKind.Light
          kindName = 'Light';
          break;
        case 2: // ColorThemeKind.Dark
          kindName = 'Dark';
          break;
        case 3: // ColorThemeKind.HighContrast
          kindName = 'High Contrast';
          break;
        default:
          kindName = 'Unknown';
      }
    } else {
      kindName = 'Unknown';
    }
    
    return {
      kind: kindName,
      name
    };
  }
}