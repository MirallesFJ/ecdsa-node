const {
  createPrivateKeySync,
} = require("ethereum-cryptography/secp256k1-compat");
const {
  hexToBytes,
  toHex,
  utf8ToBytes,
} = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak");

const PRIVATE_KEY = createPrivateKeySync();
const originalPublicKey = secp256k1.getPublicKey(PRIVATE_KEY, true);
const originalPublicKeyHex = toHex(originalPublicKey);

const message = "Hello, world!";

// Hash the message
const messageHash = keccak256(utf8ToBytes(message));

// Sign the message hash using the private key
(async () => {
  const signature = await secp256k1.sign(messageHash, PRIVATE_KEY);

  // Recover the public key from the signature and the message hash
  const recoveredPublicKeyPoint = signature.recoverPublicKey(messageHash);
  const recoveredPublicKeyHex = recoveredPublicKeyPoint.toHex(true);

  // Compare the original and recovered addresses
  if (originalPublicKeyHex === recoveredPublicKeyHex) {
    console.log(
      "✔ Success: The recovered public key matches the original public key. ✔"
    );
  } else {
    console.log(
      "❌ Error: The recovered public key does NOT match the original public key. ❌"
    );
  }
})();
