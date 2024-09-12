import { decode } from 'base-64';
import pako from 'pako';
import yaml from 'js-yaml';

export const extractSecretData = (secret: string): string => {
  const trimmedSecret = secret.trim()
  try {
    const yamlData = yaml.load(trimmedSecret) as any;
    if (yamlData.data && yamlData.data.release) {
      return yamlData.data.release;
    }
  } catch (yamlError) {
    try {
      const jsonData = JSON.parse(trimmedSecret);
      if (jsonData.data && jsonData.data.release) {
        return jsonData.data.release;
      }
    } catch (jsonError) {
    }
  }
  return trimmedSecret;
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

export function beautifyHelmSecret(decodedSecret: string): string {
  try {
    // Parse the decoded secret as JSON
    const jsonData = JSON.parse(decodedSecret);
    
    // Convert the JSON object to YAML
    const yamlString = yaml.dump(jsonData, {
      indent: 2,
      lineWidth: -1, // Disable line wrapping
      noRefs: true,  // Don't use YAML anchors and aliases
    });

    return yamlString;
  } catch (error) {
    // If parsing fails, return the original string
    console.error('Failed to beautify Helm secret:', error);
    return decodedSecret;
  }
}