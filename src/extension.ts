import * as vscode from 'vscode';
import { checkTypos } from './check_typos';

let typoDecorationType: vscode.TextEditorDecorationType;

export function activate(context: vscode.ExtensionContext) {

	// lets create a decoration type hehe
		typoDecorationType = vscode.window.createTextEditorDecorationType({
			backgroundColor: 'rgba(43, 40, 75, 0.37)' ,
			isWholeLine: true,
			overviewRulerColor: 'cornflowerblue', // color of the lil thing on the scroll bar that indicates where the typo at
			overviewRulerLane: vscode.OverviewRulerLane.Right, // where :3
			borderRadius: '0',
			after: {
				margin: '0 0 0 1em',
				color: 'cornflowerblue',
				contentText: ''
			},
		});


	const updateDecorations = (editor:vscode.TextEditor | undefined) => {
		if(!editor) {return;} // check if there is an active editor
		// first lets extract the text from the active file
		const content = editor.document.getText();

		//-------------------------------------------> all of this is the variable type btw
		const decorations: vscode.DecorationOptions[] = [];

		// now lets check for typos
		const suggestions = checkTypos(content);

		// if we have suggestions, lets show them!
		if(suggestions.length > 0){
			suggestions.forEach(({typo, suggestion}) => {
				
				const start = content.indexOf(typo);
				if(start === -1) {return;}

				const line = editor.document.positionAt(start).line;
				const lineRange = editor.document.lineAt(line).range;
				
				decorations.push({
					range: lineRange,
					renderOptions: {
						after : {
							
							contentText: `꩜ Did you mean "${suggestion}" instead of "${typo}"?`,
							color: 'cornflowerblue',
							margin: '0 0 0 2em'
						},
					}
				});

			});

			editor.setDecorations(typoDecorationType, decorations);

		} else {
			vscode.window.showInformationMessage('No typos found!');
			editor.setDecorations(typoDecorationType, []);
		}
	};

	// run asap
	if(vscode.window.activeTextEditor){
		updateDecorations(vscode.window.activeTextEditor);
	}

	// everytime editor changes
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			updateDecorations(editor);
		})
	);

	// everytime text changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(event => { //event listener that triggers every time a document changes
			const editor = vscode.window.activeTextEditor;
			if(editor && event.document === editor.document){ // if there in an active editor and the changed document matches the opened document (the one in the active editor)
				updateDecorations(editor); // then update the poor thing
			}
		})
	);
};


export function deactivate() {
	if (typoDecorationType){
		typoDecorationType.dispose();
	}
}
