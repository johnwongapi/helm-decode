import React, { useState, useEffect } from 'react';
import { decodeHelmSecret } from '../utils/helmDecoder';
import { defaultInput } from '../constants/defaultInput';

const HelmDecode: React.FC = () => {
  const [input, setInput] = useState(defaultInput);
  const [decodedOutput, setDecodedOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [liveDecode, setLiveDecode] = useState(true);

  const handleDecode = () => {
    try {
      const decoded = decodeHelmSecret(input);
      setDecodedOutput(decoded);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setDecodedOutput('');
    }
  };

  useEffect(() => {
    if (liveDecode) {
      handleDecode();
    }
  }, [input, liveDecode]);

  useEffect(() => {
    handleDecode();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc' }}>
        <h2>Helm Secret Decoder</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={defaultInput}
          style={{ width: '100%', height: '60vh', marginBottom: '10px' }}
        />
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handleDecode} disabled={liveDecode}>Decode</button>
          <label>
            <input
              type="checkbox"
              checked={liveDecode}
              onChange={(e) => setLiveDecode(e.target.checked)}
            />
            Live Decode
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        <h3>Decoded Output:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {decodedOutput}
        </pre>
      </div>
    </div>
  );
};

export default HelmDecode;