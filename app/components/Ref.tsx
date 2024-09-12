import React, { useState, ChangeEvent } from 'react';

function AIChatHistory() {
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="file"
            checked={inputMethod === 'file'}
            onChange={() => setInputMethod('file')}
          />
          Upload File
        </label>
        <label>
          <input
            type="radio"
            value="text"
            checked={inputMethod === 'text'}
            onChange={() => setInputMethod('text')}
          />
          Input Text
        </label>
      </div>
      {inputMethod === 'file' ? (
        <input type="file" onChange={handleFileChange} />
      ) : (
        <textarea
          value={textInput}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextInput(e.target.value)}
          placeholder="Enter your text here"
        />
      )}
    </div>
  );
}

export default AIChatHistory;