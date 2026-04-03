// import { publicEncrypt, constants } from 'crypto';

/** Encrypt with Public Key
    export const encryptWithPublicKey = (plaintext: string, publicKeyPem: string): string => {
        if (!plaintext) throw new Error('Plaintext is required');
        if (!publicKeyPem) throw new Error('Public key PEM is required');


        const encrypted = publicEncrypt(
            {
                key: publicKeyPem,
                padding: constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            Buffer.from(plaintext, 'utf8'),
        );

        return encrypted.toString('base64');
    }
*/

/** Encrypt with Public Key */
// Helper: convert PEM string to ArrayBuffer
const importRsaPublicKey = async (pem: string): Promise<CryptoKey> => {
  // remove the "BEGIN/END" wrapper and line breaks
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "spki",
    der.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"],
  );
};

// Helper: ArrayBuffer → Base64
const bufToBase64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const encryptPassword = async (plain: string, publicKeyPem: string) => {
  try {
    const key = await importRsaPublicKey(publicKeyPem);
    const encrypted = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      key,
      new TextEncoder().encode(plain),
    );

    return bufToBase64(encrypted); // send this to backend
  } catch (e) {
    console.log(e);
    throw e;
  }
};
