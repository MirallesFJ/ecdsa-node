import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <select name="adress" id="adress" value={address} onChange={onChange}>
          <option value="" disabled selected>
            Select your wallet
          </option>
          <option value="66ca7aaa696900bc3c860f6466caf1872148d0c3">
            1- 0x66ca7aaa696900bc3c860f6466caf1872148d0c3
          </option>
          <option value="7b2a34b740db0102adba78ef23a1717c272ba480">
            2- 0x7b2a34b740db0102adba78ef23a1717c272ba480
          </option>
          <option value="e0a33d8701f62890062abf24e7bb4f9d375e5b80">
            3- 0xe0a33d8701f62890062abf24e7bb4f9d375e5b80
          </option>
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
