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

// Derive the address from the original public key
const originalPublicKeyHash = keccak256(originalPublicKey.slice(1)); // Remove the first byte (0x02 or 0x03)
const originalAddress = toHex(originalPublicKeyHash.slice(-20));

const message = "Hello, world!";

// Hash the message
const messageHash = keccak256(utf8ToBytes(message));

// Sign the message hash using the private key
// (async () => {
// const signature = await secp256k1.sign(messageHash, PRIVATE_KEY);
const signature = secp256k1.sign(messageHash, PRIVATE_KEY);

// Recover the public key from the signature and the message hash
const recoveredPublicKeyPoint = signature.recoverPublicKey(messageHash);
const recoveredPublicKey = recoveredPublicKeyPoint.toRawBytes(true); // true for compressed

// Derive the address from the recovered public key
const recoveredPublicKeyHash = keccak256(recoveredPublicKey.slice(1)); // Remove the first byte (0x02 or 0x03)
const recoveredAddress = toHex(recoveredPublicKeyHash.slice(-20));

// Compare the original and recovered addresses
if (originalAddress === recoveredAddress) {
  console.log(
    "\n✔ Success: The recovered address matches the original address. ✔\n"
  );
} else {
  console.log(
    "❌ Error: The recovered address does NOT match the original address. ❌"
  );
}
// })();
