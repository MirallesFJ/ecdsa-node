import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak";

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

module.exports = {
  signMessage,
  validateSignature,
};
