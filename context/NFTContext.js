import { createContext, useContext, useEffect, useState } from 'react';
import Web3Modal from 'web3modal'
import { ethers } from 'ethers';
import axios from 'axios';
import { MarketAddress, MarketAddressABI } from './constants';
import { create as ipfsHttpClient } from 'ipfs-http-client'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider)

const NFTContext = createContext();

export function NFTProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState('')
  const nftCurrency = 'ETH'

  async function checkIfWalletIsConnected() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  }

  async function uploadToIPFS(file) {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      return url
    } catch (error) {
      console.log('Error uploading file to IPFS', error)
    }
  }

  async function createNFT(formInput, fileUrl, router) {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return;

    // might need to add the price to the data
    const data = JSON.stringify({ name, description, image: fileUrl })
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`

      await createSale(url, price);

      router.push('/')
    } catch (error) {
      console.log('Error uploading file to IPFS', error)
    }
  }

  async function createSale(url, formInputPrice, isReselling, id) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer)
    
    const listingPrice = await contract.getListingPrice()

    const transaction = !isReselling 
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() })
      
    await transaction.wait();
  }

  async function fetchNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider)

    const data = await contract.fetchMarketItems()

    const items = await Promise.all(data.map(async({tokenId, seller, owner, price: unformattedPrice}) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const {data: { image, name, description } } = await axios.get(tokenURI)
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      }
    }))
    return items
  }

  async function fetchMyNftsOrListedNFTs(type) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed'
      ? await contract.fetchItemsListed()
      : await contract.fetchMyNFTs()

      const items = await Promise.all(data.map(async({tokenId, seller, owner, price: unformattedPrice}) => {
        
        const tokenURI = await contract.tokenURI(tokenId);
        const {data: { image, name, description } } = await axios.get(tokenURI)
        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');
        
        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI,
        }
      }))
      return items
  }

  async function buyNFT(nft) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
    await transaction.wait();
  }

  return (
    <NFTContext.Provider value={{ nftCurrency, currentAccount, connectWallet, uploadToIPFS, createNFT, fetchNFTs, fetchMyNftsOrListedNFTs, buyNFT, createSale }}>
      {children}
    </NFTContext.Provider>
  )
}

export default function useMarketNft() {
  const context = useContext(NFTContext)
  if (context === undefined) {
    throw new Error("useMarketNft must be used with NFTContext");
  }
  return context
}

