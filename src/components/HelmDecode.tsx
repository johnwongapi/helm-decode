import React, { useState, useEffect } from 'react';
import { decodeHelmSecret, beautifyHelmSecret } from '../utils/helmDecoder';
import { defaultInput } from '../constants/defaultInput';

interface HelmDecodeProps {
  darkMode: boolean;
}

const HelmDecode: React.FC<HelmDecodeProps> = ({ darkMode }) => {
  const [input, setInput] = useState(defaultInput);
  const [decodedOutput, setDecodedOutput] = useState('');
  const [beautifiedOutput, setBeautifiedOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [outputType, setOutputType] = useState<'raw' | 'beautified'>('beautified');
  const [copyMessage, setCopyMessage] = useState('');

  const handleDecode = () => {
    try {
      const decoded = decodeHelmSecret(input);
      setDecodedOutput(decoded);
      const beautified = beautifyHelmSecret(decoded);
      setBeautifiedOutput(beautified);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setDecodedOutput('');
      setBeautifiedOutput('');
    }
  };

  useEffect(() => {
    handleDecode();
  }, [input]);

  const handleCopy = () => {
    const textToCopy = outputType === 'raw' ? decodedOutput : beautifiedOutput;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyMessage('Failed to copy');
      setTimeout(() => setCopyMessage(''), 2000);
    });
  };

  const sectionStyle: React.CSSProperties = {
    flex: '1 1 0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    minWidth: 0,
    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
    color: darkMode ? '#ffffff' : '#000000',
  };

  const outputStyle: React.CSSProperties = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    backgroundColor: darkMode ? '#2d2d2d' : '#f4f4f4',
    border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
    borderRadius: '4px',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '1.4',
    flex: 1,
    overflow: 'auto',
    color: darkMode ? '#ffffff' : '#000000',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    margin: '0 5px',
    border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
    borderRadius: '4px',
    background: darkMode ? '#3a3a3a' : '#f4f4f4',
    cursor: 'pointer',
    fontSize: '16px',
    color: darkMode ? '#ffffff' : '#000000',
  };

  const copyButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    padding: '10px',
    marginLeft: '5px',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: darkMode ? '#1e1e1e' : '#ffffff' }}>
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2>Helm Secret Decoder</h2>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={defaultInput}
          style={{
            width: '100%',
            flex: 1,
            marginBottom: '10px',
            resize: 'none',
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
          }}
        />
      </div>
      <div style={{ ...sectionStyle, flex: '2 1 0' }}>
        <div style={{ marginBottom: '10px' }}>
          <h3>Decoded Output:</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              style={{
                ...buttonStyle,
                background: outputType === 'beautified' ? (darkMode ? '#555' : '#ddd') : (darkMode ? '#3a3a3a' : '#f4f4f4'),
              }}
              onClick={() => setOutputType('beautified')}
            >
              Beautified
            </button>
            <button
              style={{
                ...buttonStyle,
                background: outputType === 'raw' ? (darkMode ? '#555' : '#ddd') : (darkMode ? '#3a3a3a' : '#f4f4f4'),
              }}
              onClick={() => setOutputType('raw')}
            >
              Raw
            </button>
            <button onClick={handleCopy} style={copyButtonStyle} title="Copy to clipboard">
              <span role="img" aria-label="Copy">📋</span>
            </button>
            {copyMessage && (
              <span style={{
                marginLeft: '10px',
                color: darkMode ? '#8f8' : 'green',
              }}>
                {copyMessage}
              </span>
            )}
          </div>
        </div>
        <pre style={outputStyle}>
          {error ? (
            <span style={{ color: darkMode ? '#f88' : 'red' }}>{error}</span>
          ) : (
            outputType === 'beautified' ? beautifiedOutput : decodedOutput
          )}
        </pre>
      </div>
    </div>
  );
};

export default HelmDecode;