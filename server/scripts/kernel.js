const {
  createPrivateKeySync,
} = require("ethereum-cryptography/secp256k1-compat");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak");

function signMessage(message, privateKey) {
  // Hash the message
  const messageHash = keccak256(utf8ToBytes(message));

  // Sign the message hash using the private key
  const signature = secp256k1.sign(messageHash, privateKey);

  return signature;
}

function validateSignature(message, signature) {
  // Extract sender address from jsonMessage
  const jsonMessage = JSON.parse(message);
  const senderAdress = jsonMessage.sender;

  const messageHash = keccak256(utf8ToBytes(message));
  // Recover the public key from the signature and the message hash
  const recoveredPublicKeyPoint = signature.recoverPublicKey(messageHash);
  const recoveredPublicKey = recoveredPublicKeyPoint.toRawBytes(true); // true for compressed

  // Derive the address from the recovered public key
  const recoveredPublicKeyHash = keccak256(recoveredPublicKey.slice(1)); // Remove the first byte (0x02 or 0x03)
  const recoveredAddress = toHex(recoveredPublicKeyHash.slice(-20));

  return senderAdress === recoveredAddress;
}

// Example usage
const PRIVATE_KEY = createPrivateKeySync();
const PRIVATE_KEY_HEX = toHex(PRIVATE_KEY);
const PRIVATE_KEY_MANUAL =
  "76e7514f19afd94364f84e4339cb96bc9e2d11feb7274da32e21f89cb44445d3";

const originalPublicKey = secp256k1.getPublicKey(PRIVATE_KEY, true);
const originalPublicKeyHash = keccak256(originalPublicKey.slice(1)); // Remove the first byte (0x02 or 0x03)
const originalAddress = toHex(originalPublicKeyHash.slice(-20));
const addressManual = "1e1b5e9a5909fafdcb6b23ff4bd7fed1ce18c2f7";

const jsonMessage = {
  sender: addressManual,
  receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
  amount: 100,
};
const message = JSON.stringify(jsonMessage);
const isValid = validateSignature(
  message,
  signMessage(message, PRIVATE_KEY_MANUAL)
);
console.log(
  isValid
    ? "✔ Success: The addresses match."
    : "❌ Error: The addresses do NOT match."
);
