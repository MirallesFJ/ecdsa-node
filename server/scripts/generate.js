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
const publicKey = secp256k1.getPublicKey(privateKey); // Compressed

// Hash the public key using keccak256
const publicKeyHash = keccak256(publicKey);

// Take the last 20 bytes of the hash to get the address
const address = toHex(publicKeyHash.slice(-20));
console.log("Original Address: ", address);

message = "Hello, world!";

const messageHash = keccak256(utf8ToBytes(message));

const signature = secp256k1.sign(messageHash, privateKey);

recoveredPublicKey = signature.recoverPublicKey(messageHash);

// Extract the `x` and `y` values from the recovered public key (in `Point` format)
const recoveredX = toHex(
  utf8ToBytes(recoveredPublicKey.px.toString(16).padStart(64, "0"))
);
const recoveredY = toHex(
  utf8ToBytes(recoveredPublicKey.py.toString(16).padStart(64, "0"))
);
// Concatenate the `x` and `y` values
const recoveredPublicKeyBytes = hexToBytes("04" + recoveredX + recoveredY);
// Hash the concatenated public key using keccak256
const recoveredPublicKeyHash = keccak256(recoveredPublicKeyBytes);
// Take the last 20 bytes to derive the address
const recoveredAddress = toHex(recoveredPublicKeyHash.slice(-20));

console.log("Recovered Address: ", recoveredAddress);

// Compare the original and recovered addresses
if (recoveredAddress === address) {
  console.log(
    "✔ Success: The recovered address matches the original address. ✔"
  );
} else {
  console.log(
    "❌ Error: The recovered address does NOT match the original address. ❌"
  );
}
