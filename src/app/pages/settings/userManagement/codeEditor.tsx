import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

function CodeEditor(props:any) {
  const [code, setCode] = useState(props.props || '');

  function handleChange(editor:any, data:any, value:any) {
    setCode(value);
    if (props.onChange) {
      props.onChange(value);
    }
  }

  return (
    <div className="code-editor">
      <CodeMirror
        value={code}
        onBeforeChange={handleChange}
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
          tabSize: 2,
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: code }}></div>
    </div>
  );
}

export default CodeEditor;