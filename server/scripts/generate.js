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

const privateKey = createPrivateKeySync();
const publicKey = secp256k1.getPublicKey(privateKey);

console.log("Private key:", toHex(privateKey));
console.log("Public key:", toHex(publicKey));
