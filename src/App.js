import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FighterFactory from './artifacts/contracts/fighter/fighterfactory.sol/FighterFactory.json'
import './App.css';
import img1 from "./img/1.png"
import img2 from "./img/2.png"
import img3 from "./img/3.png"
import img4 from "./img/4.png"
import img5 from "./img/5.png"
import img6 from "./img/6.png"
import img7 from "./img/7.png"
import img8 from "./img/8.png"
import img9 from "./img/9.png"
import img10 from "./img/10.png"

const FighterFactoryAddress = "0x0895EF323e0A0C03598aD3371c72528082c20520";



function App() {
  const [error, setError] = useState('');
  const [data, setData] = useState({})

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(FighterFactoryAddress, FighterFactory.abi, provider);
      try {
        const cost = await contract.cost();
        const totalSupply = await contract.totalSupply();
        const object = {"cost": String(cost), "totalSupply": String(totalSupply)}
        setData(object);
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(FighterFactoryAddress, FighterFactory.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost
        }
        const transaction = await contract.createFighter( 'olivier', 1, overrides);
        await transaction.wait();
        fetchData();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="App">
      <div className="Container">
        <div className="banner">
          <img src={img1} alt="img" />
          <img src={img2} alt="img" />
          <img src={img3} alt="img" />
          <img src={img4} alt="img" />
          <img src={img5} alt="img" />
          <img src={img6} alt="img" />
          <img src={img7} alt="img" />
          <img src={img8} alt="img" />
          <img src={img9} alt="img" />
          <img src={img10} alt="img" />
        </div>
        {error && <p>{error}</p>}
        <h1>Mint a UFCrypto Fighter NFT!</h1>
        <p className="count">A total of {data.totalSupply} UFCrypto NFT were already minted</p>
        <p className="price">Each UFCrypto Fighter costs {data.cost / 10**18}ETH</p>
        <button onClick={mint}>Buy One UFCrypto Fighter</button>
      </div>
    </div>
  );
}

export default App;
