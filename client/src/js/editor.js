// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getDb().then((data) => {

      // Set initial data value to an empty string.
      let strData = "";
      
      // If we have data then get the last record in the database and set the data string value.
      // This should always be the first element in the array, index = 0.
      // Add this testing so things will work no matter what happens.
      if (data.length > 0)
      {
        strData += data[data.length - 1].jate;
      }

      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(strData || localData || header);
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // For change event save the data to local storage.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Save the content of the editor to IndexDB database when the editor itself is loses focus.
    // Call the putDb database function.
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });
  }
}
