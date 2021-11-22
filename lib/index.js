/**
 * A notebook widget extension that adds a button to the toolbar.
 */
 import {
  ToolbarButton
} from '@jupyterlab/apputils';
import {
  DisposableDelegate
} from '@phosphor/disposable';

import { Widget, Panel } from '@lumino/widgets';

import OpenAI from 'openai-api';

import {
  NotebookActions
} from '@jupyterlab/notebook/lib/actions';

import { ElementExt } from '@lumino/domutils';

function capitalize(s)
{
    return s && s[0].toUpperCase() + s.slice(1);
}

class NotebookExtension {
   /**
    * Create a new extension object.
    */
   createNew(panel, context) {
      
     const notebook = panel.content
     this.notebook = notebook;
     this.sessionContext = context.sessionContext;

       let callback = () => {
          // NotebookActions.insertBelow(notebook);
          this.addCell('### Print Hello World', 'print("hello world")')
       };
       let button = new ToolbarButton({
         className: 'myButton22',
         iconClass: 'ui-components:save',
         onClick: callback,
         tooltip: 'Run All 22'
       });
       panel.toolbar.insertItem(0, 'runAll22', button);
     
     return new DisposableDelegate(() => {
       button.dispose();
     });
   }

    /**
   * Get the state of a widget before running an action.
   */
  getState(notebook) {
    return {
      wasFocused: notebook.node.contains(document.activeElement),
      activeCell: notebook.activeCell
    };
  }

  /**
   * Handle the state of a widget after running an action.
   */
  handleState(
    notebook,
    state,
    scrollIfNeeded = false
  ) {
    const { activeCell, node } = notebook;

    if (state.wasFocused || notebook.mode === 'edit') {
      notebook.activate();
    }

    if (scrollIfNeeded && activeCell) {
      ElementExt.scrollIntoViewIfNeeded(node, activeCell.node);
    }
  }

   getCodeHistory(){
    const cells = this.notebook.model.cells;
    const history = [];
    let firstMarkdown = true;
    for (let i = 0; i < cells.length; i++) {
      if(i>this.notebook.activeCellIndex) break;
      const cell = cells.get(i);
      if (cell.type === 'code') {
        history.push(cell.value.text)
      }
      else if (cell.type === 'markdown') {
        const text = cell.value.text;
        let newText;
        if (firstMarkdown) {
          newText = '"""\n' + text + '\n"""'
          firstMarkdown = false;
        }
        else{
          // add ## before each line in the text
          const lines = text.split('\n');
          // remove leading # and add ##
          newText = lines.map(line => '## ' + line.replace(/^(\#+\s)/,"")).join('\n');
        }

        history.push(newText)
      }
    }
    return history
   }

   addCell(doc, code) {
    const notebook = this.notebook;
    if (!notebook.model || !notebook.activeCell) {
      return;
    }
    const state = this.getState(notebook);
    const model = notebook.model;
    // 
    
    const docCell = model.contentFactory.createMarkdownCell({});
    docCell.value.text = doc
    model.cells.insert(notebook.activeCellIndex + 1, docCell);

    const codeCell = model.contentFactory.createCodeCell({});
    codeCell.value.text = code // 'print("hello world")'
    model.cells.insert(notebook.activeCellIndex + 2, codeCell);
    notebook.activeCellIndex+=2;
    this.lastCellIndex = notebook.activeCellIndex
    this.lastCellNumber = 2

    notebook.deselectAll();
    this.handleState(notebook, state, true);

    // Try to execute the cell
    NotebookActions.run(this.notebook, this.sessionContext)
   }

   addMarkdown(markdown){
    const notebook = this.notebook;
    if (!notebook.model || !notebook.activeCell) {
      return;
    }
    const state = this.getState(notebook);
    const docCell = model.contentFactory.createMarkdownCell({});
    docCell.value.text = markdown
    model.cells.insert(notebook.activeCellIndex + 1, docCell);
    notebook.activeCellIndex+=1;
    this.lastCellIndex = notebook.activeCellIndex
    this.lastCellNumber = 1
    notebook.deselectAll();
    this.handleState(notebook, state, true);
   }

   runCell(){
    NotebookActions.run(this.notebook, this.sessionContext)
   }

   runAllCells(){
    NotebookActions.runAll(this.notebook, this.sessionContext)
   }

   undoCell(){
     if(this.lastCellIndex && this.lastCellIndex > 0){
       for(let i=0;i<this.lastCellNumber;i++){
        NotebookActions.cut(this.notebook)
       }
        notebook.activeCellIndex = this.lastCellIndex - (this.lastCellNumber-1)
        this.lastCellIndex = this.lastCellIndex - (this.lastCellNumber-1)
     }
   }
}

export default {
  id: 'imjoy-jupyterlab',
  autoStart: true,
  activate: function (app) {
    console.log(
      'JupyterLab extension imjoy-jupyterlab is activated!'
    );
    console.log(app.commands);
    const nbExt = new NotebookExtension()
    app.docRegistry.addWidgetExtension('Notebook', nbExt);

    class ContentWidget extends Widget {
      constructor() {
          super();
          this.addClass('content'); 
          this.id = 'tutorial'
          this.title.label = 'Codex Chat Notebook'
          this.title.closable = true;
          this.createNode()
      }

      setupSpeech(){
        if ("webkitSpeechRecognition" in window) {
          let speechRecognition = new webkitSpeechRecognition();
          let final_transcript = "";
          let started = false;
          // const colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'segment', 'cells' ];
          // const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
          // var speechRecognitionList = new SpeechGrammarList();
          // speechRecognitionList.addFromString(grammar, 1);
          // speechRecognition.grammars = speechRecognitionList;
          speechRecognition.continuous = true;
          speechRecognition.interimResults = true;
          speechRecognition.lang = 'en-US';
          this.speechButton.style.background = "";
        
          speechRecognition.onstart = () => {
            started = true;
            final_transcript = '';
            this.speechButton.style.background = "LightGoldenRodYellow";
          };
          speechRecognition.onerror = () => {
            started = false;
            this.speechButton.style.background = "red";
            console.log("Speech Recognition Error");
          };
          speechRecognition.onend = () => {
            started = false;
            this.speechButton.style.background = "";
            console.log("Speech Recognition Ended");
          };
        
          speechRecognition.onresult = (event) => {
            let interim_transcript = "";
        
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                this.inputBox.value = final_transcript;
              } else {
                interim_transcript += event.results[i][0].transcript;
                this.inputBox.value = interim_transcript;
              }
            }
          };
          this.speechRecognition = speechRecognition;
          this.speechButton.onclick = () => {
            if (started) {
              speechRecognition.stop();
            }
            else{
              speechRecognition.start();
            }
          };
        } else {
          console.error("Speech Recognition Not Available");
          this.speechButton.style.display = "none";
        }
      }

      createNode() {
        this.node.innerHTML = `<h2>Chat Notebook</h2><p>Built with OpenAI GPT-3 and Codex, by Wei Ouyang</p>`
        this.node.style.padding = "10px"
        this.node.style.background = "white";
        this.node.style.height = "100%";
        this.node.style.overflow = "auto";
        this.tokenInput = document.createElement('input')
        this.tokenInput.style.display = "block";
        this.tokenInput.style.width = "100%";
        this.tokenInput.style.color = "gray";
        this.tokenInput.type = "password";
        this.inputBox = document.createElement('textarea')
        this.inputBox.style.marginTop = "10px";
        this.inputBox.style.display = "block";
        this.inputBox.style.width = "100%";
        this.inputBox.style.height = "6rem";
        this.inputBox.style.fontSize = "16px";
        this.speechButton = document.createElement('button')
        this.speechButton.innerHTML = 'Voice'
        this.speechButton.style.width = "40%";
        this.speechButton.style.height = "20px";
        this.speechButton.style.fontSize = "16px";
        this.speechButton.style.display = "inline-block";
        this.speechButton.classList.add("bp3-button", "bp3-minimal", "jp-ToolbarButtonComponent", "minimal", "jp-Button")
        this.undoButton = document.createElement('button')
        this.undoButton.style.width = "30%";
        this.undoButton.style.height = "20px";
        this.undoButton.style.fontSize = "16px";
        this.undoButton.innerHTML = 'Undo'
        this.undoButton.style.display = "inline-block";
        this.undoButton.classList.add("bp3-button", "bp3-minimal", "jp-ToolbarButtonComponent", "minimal", "jp-Button")
        this.clearButton = document.createElement('button')
        this.clearButton.style.width = "30%";
        this.clearButton.style.height = "20px";
        this.clearButton.style.fontSize = "16px";
        this.clearButton.innerHTML = 'Clear'
        this.clearButton.style.display = "inline-block";
        this.clearButton.classList.add("bp3-button", "bp3-minimal", "jp-ToolbarButtonComponent", "minimal", "jp-Button")
        this.executeButton = document.createElement('button')
        this.executeButton.innerHTML = 'Execute'
        this.executeButton.style.display = "block";
        this.executeButton.style.fontSize = "16px";
        this.executeButton.style.width = "100%";
        this.executeButton.classList.add("bp3-button", "bp3-minimal", "jp-ToolbarButtonComponent", "minimal", "jp-Button")
       
        this.node.appendChild(this.tokenInput)
        this.node.appendChild(this.inputBox)
        this.node.appendChild(this.speechButton)
        this.node.appendChild(this.clearButton)
        this.node.appendChild(this.undoButton)
        this.node.appendChild(this.executeButton)
        
        this.requestedCodeElm = document.createElement('pre')
        this.requestedCodeElm.style.color = 'gray'
        this.respondCodeElm = document.createElement('pre')
        this.respondCodeElm.style.color = 'blue'
        this.node.appendChild(this.requestedCodeElm)
        this.node.appendChild(this.respondCodeElm)

        let openai;
        const lastToken = localStorage.getItem('openai-token');
        if (lastToken) {
            openai = new OpenAI(lastToken);
            this.tokenInput.value = lastToken;
        }
        this.tokenInput.onchange = () => {
          openai = new OpenAI(this.tokenInput.value);
          localStorage.setItem('openai-token', this.tokenInput.value);
        }

        this.executeButton.onclick = async () => {
          if(this.speechRecognition) this.speechRecognition.stop();
          const command = capitalize(this.inputBox.value.trim())
          if(command.length <=0) return;
          const prompt = nbExt.getCodeHistory().join('\n') + `\n## ${command}\n`
          this.requestedCodeElm.innerHTML = prompt
          const gptResponse = await openai.complete({
            engine: 'davinci-codex',
            prompt,
            maxTokens: 500,
            temperature: 0.1,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ['## ']
          });
          console.log(gptResponse.data);
          const completion = gptResponse.data.choices[0].text.trim()
          this.respondCodeElm.innerHTML = completion
          if(completion.startsWith('%undo')){
            nbExt.undoCell()
          }
          else if(completion.startsWith('%run')){
            nbExt.runCell()
          }
          else if(completion.startsWith('%run-all')){
            nbExt.runAllCells()
          }
          else if(completion.startsWith('%markdown')){
            // remove the %markdown from the completion
            const markdown = completion.substring(10)
            nbExt.addMarkdown(markdown)
          }
          else{
            nbExt.addCell("# " + command.trim(), completion)
          }
          this.inputBox.value = '';
        }
        this.undoButton.onclick = async () => {
          if(this.speechRecognition) this.speechRecognition.stop();
          nbExt.undoCell()
        }
        this.clearButton.onclick = async () => {
          if(this.speechRecognition) this.speechRecognition.stop();
          this.inputBox.value = '';
        }
        this.setupSpeech()
      }
    }
    const panel = new Panel();
    panel.id = 'Example-tab';
    panel.title.iconClass = 'jp-MaterialIcon jp-LinkIcon';
    panel.addWidget(new ContentWidget());
    app.shell.add(panel, 'left', { rank: 1 })
  }
}

