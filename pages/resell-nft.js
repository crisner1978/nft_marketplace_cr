/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { Button, Input, Loader } from "components";
import useMarketNft from "context/NFTContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ResellNFT = () => {
  const { createSale, isLoadingNFT } = useMarketNft();
  const router = useRouter()
  const { tokenId, tokenURI } = router.query
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  // const fetchNFT = async() => {
  //   const { data } = await axios.get(tokenURI)
  //   console.log("data", data)
  //   setImage(data.image)
  //   setLoading(false)
  // }

  useEffect(() => {
    if(tokenURI) {
      const fetchNFT = async() => {
        const { data } = await axios.get(tokenURI)
        // setPrice was here but not getting on the data so removed
        setImage(data.image)
      }
      fetchNFT()
    };
  }, [tokenURI])

  if (isLoadingNFT)
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );

  const resell = async() => {
    await createSale(tokenURI, price, true, tokenId)
    router.push('/')
  }
  
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">Resell NFT</h1>
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleChange={(e) => setPrice(e.target.value)}
          />
          {image && (
            <img src={image} alt="NFT" className="rounded-xl mt-4" width={350} />
          )}

          <div className="mt-7 w-full flex justify-end">
            <Button
              btnName='List NFT'
              classStyles='rounded-xl'
              handleClick={resell}
            />
          </div>
      </div>
    </div>
  )
}

export default ResellNFT