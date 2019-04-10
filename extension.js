// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jit-vsc" is now active!');


	function getDottedPathOfSelection(){
		let editor = vscode.window.activeTextEditor;
		let currentFileURI = editor.document.uri;
		let relativePath = vscode.workspace.asRelativePath(currentFileURI);
		let moduleDotPath = relativePath.replace('.py', '').replace(/\//g, '.');
		let result = moduleDotPath;
		if (editor.selections.length == 1 && !editor.selection.isEmpty){
			result += '.' + editor.document.getText(editor.selection);
		}
		return result
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('jit-vsc.copyDottedPath', function () {
		let result = getDottedPathOfSelection();
		vscode.env.clipboard.writeText(result);
	});

	let disposable2 = vscode.commands.registerCommand('jit-vsc.copyImport', function () {
		let result = getDottedPathOfSelection();
		let parts = result.split('.')
		let statement = '';
		if (parts.length > 1) {
			statement = 'from ' + parts.slice(0, -1).join('.') + ' import ' + parts[parts.length-1];
		} else {
			statement = 'import ' + parts[0];
		}
		vscode.env.clipboard.writeText(statement);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
