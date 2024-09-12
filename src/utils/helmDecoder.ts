import { decode } from 'base-64';
import pako from 'pako';
import yaml from 'js-yaml';

export const extractSecretData = (secret: string): string => {
  try {
    const yamlData = yaml.load(secret) as any;
    if (yamlData.data && yamlData.data.release) {
      return yamlData.data.release;
    }
  } catch (yamlError) {
    try {
      const jsonData = JSON.parse(secret);
      if (jsonData.data && jsonData.data.release) {
        return jsonData.data.release;
      }
    } catch (jsonError) {
    }
  }
  return secret;
};

export const decodeBase64 = (data: string): string => {
  let decodedData = data.replace(/^"|"$/g, '');
  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decode(decodedData);
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(decoded)) {
        throw new Error('Invalid decoded result');
      }
      decodedData = decoded;
    } catch {
      break;
    }
  }
  return decodedData;
};

export const decompressGzip = (data: string): string => {
  const compressedData = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  const decompressedData = pako.inflate(compressedData);
  return new TextDecoder().decode(decompressedData);
};

export const decodeHelmSecret = (secret: string): string => {
  const secretData = extractSecretData(secret);
  const decodedData = decodeBase64(secretData);
  return decompressGzip(decodedData);
};