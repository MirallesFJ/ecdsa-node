const {
  createPrivateKeySync,
} = require("ethereum-cryptography/secp256k1-compat");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak");

function messageValidator(message, privateKey) {
  const originalPublicKey = secp256k1.getPublicKey(privateKey, true);

  // Derive the address from the original public key
  const originalPublicKeyHash = keccak256(originalPublicKey.slice(1)); // Remove the first byte (0x02 or 0x03)
  const originalAddress = toHex(originalPublicKeyHash.slice(-20));

  // Hash the message
  const messageHash = keccak256(utf8ToBytes(message));

  // Sign the message hash using the private key
  const signature = secp256k1.sign(messageHash, privateKey);

  // Recover the public key from the signature and the message hash
  const recoveredPublicKeyPoint = signature.recoverPublicKey(messageHash);
  const recoveredPublicKey = recoveredPublicKeyPoint.toRawBytes(true); // true for compressed

  // Derive the address from the recovered public key
  const recoveredPublicKeyHash = keccak256(recoveredPublicKey.slice(1)); // Remove the first byte (0x02 or 0x03)
  const recoveredAddress = toHex(recoveredPublicKeyHash.slice(-20));

  // Compare the original and recovered addresses
  return originalAddress === recoveredAddress;
}

// Example usage
const PRIVATE_KEY = createPrivateKeySync();
const message = "Hello, world!";
const isValid = messageValidator(message, PRIVATE_KEY);
console.log(
  isValid
    ? "✔ Success: The addresses match."
    : "❌ Error: The addresses do NOT match."
);
