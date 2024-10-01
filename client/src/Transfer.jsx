import { useState } from "react";
import server from "./server";
// import { validateSignature } from "./kernel"; // Import functions from kernel.js
// import { signMessage } from "./kernel";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const jsonMessage = {
      sender: address.replace(/^[0-9]x/, ""), // Remove any prefix,
      receiver: recipient,
      amount: sendAmount,
    };
    const message = JSON.stringify(jsonMessage);
    console.log("message: ", message);

    const signature = signMessage(message, privateKey);
    const isValid = validateSignature(message, signature);

    if (!isValid) {
      alert("Invalid signature");
      return;
    }
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address.replace(/^[0-9]x/, ""), // Remove any prefix
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

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
    const recoveredPublicKeyHash = keccak256(recoveredPublicKey); // Remove the first byte (0x02 or 0x03)
    const recoveredAddress = toHex(recoveredPublicKeyHash.slice(-20));
    console.log("senderAdress: ", senderAdress);
    console.log("recoveredAddress: ", recoveredAddress);
    return senderAdress === recoveredAddress;
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <select
          name="adress"
          id="adress"
          value={recipient}
          onChange={setValue(setRecipient)}
        >
          <option value="" disabled selected>
            Select your wallet
          </option>
          <option value="66ca7aaa696900bc3c860f6466caf1872148d0c3">
            1 - 0x66ca7aaa696900bc3c860f6466caf1872148d0c3
          </option>
          <option value="7b2a34b740db0102adba78ef23a1717c272ba480">
            2 - 0x7b2a34b740db0102adba78ef23a1717c272ba480
          </option>
          <option value="e0a33d8701f62890062abf24e7bb4f9d375e5b80">
            3 - 0xe0a33d8701f62890062abf24e7bb4f9d375e5b80
          </option>
        </select>
      </label>

      <label>
        Private Key
        <select
          name="privateKey"
          id="privateKey"
          value={privateKey}
          onChange={(evt) => setPrivateKey(evt.target.value)}
        >
          <option value="" disabled selected>
            Select your private key
          </option>
          <option value="028d4b5670727d74b36f4c071c1230218201214bc507bd46633c546fbe900581">
            1 - 028d4b5670727d74b36f4c071c1230218201214bc507bd46633c546fbe900581
          </option>
          <option value="8a26c5816c9581a209ed64885b2bab8599f238e7f5ff10fd5836b13c96b50bd3">
            2 - 8a26c5816c9581a209ed64885b2bab8599f238e7f5ff10fd5836b13c96b50bd3
          </option>
          <option value="d7e90afeefd389d07a29543a44800354f04aab5d12b787fa25af04b994696f39">
            3 - d7e90afeefd389d07a29543a44800354f04aab5d12b787fa25af04b994696f39
          </option>
          <option value="00090afeefd389d07a29543a44800354f04aab5d12b737fa25af04b994696f30">
            Wrong Key -
            00090afeefd389d07a29543a44800354f04aab5d12b737fa25af04b994696f30
          </option>
        </select>
      </label>

      {/* <label>
        Private Key
        <input
          placeholder="Enter your private key"
          type="password"
          required
        ></input>
      </label> */}

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
