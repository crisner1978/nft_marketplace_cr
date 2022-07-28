import { Banner, Loader, NFTCard, SearchBar } from "components";
import useMarketNft from "context/NFTContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import images from "../assets";
import { shortenAddress } from "utils/shortenAddress";

const MyNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { fetchMyNftsOrListedNFTs, currentAccount } = useMarketNft();
  const [activeSelect, setActiveSelect] = useState("Recently Added");

  useEffect(() => {
    fetchMyNftsOrListedNFTs().then((items) => {
      setNfts(items);
      setNftsCopy(items);
      setLoading(false);
    });
  }, [fetchMyNftsOrListedNFTs]);

  const SORT_MAP = {
    "Recently Added": (a, b) => b.tokenId - a.tokenId,
    "Price (low to high)": (a, b) => a.price - b.price,
    "Price (high to low)": (a, b) => b.price - a.price,
  };

  if (isLoading)
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );

  const onHandleSearch = (value) => {
    const filtered = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length) {
      setNfts(filtered);
    } else {
      setNfts(nftsCopy);
    }
    return filtered
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          image
          bannerText="Your Super NFTs"
          childStyles="text-center mb-5 absolute md:text-4xl sm:text-2xl xs:text-xl text-left text-nft-black-3"
          parentStyles="h-80 justify-center"
        />
        <div className="flexCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 dark:bg-white bg-nft-black-2 rounded-full">
            <Image
              src={images.creator1}
              objectFit="cover"
              alt="profile"
              className="rounded-full"
            />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
            {shortenAddress(currentAccount)}
          </p>
        </div>
      </div>
      {!isLoading && !nfts.length && !nftsCopy.length ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">
            No NFTs Owned
          </h1>
        </div>
      ) : (
        <div className="px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            <SearchBar
              activeSelect={activeSelect}
              setActiveSelect={setActiveSelect}
              handleSearch={onHandleSearch}
              clearSearch={onClearSearch}
              SORT_MAP={SORT_MAP}
            />
          </div>
          <div className="mt-3 w-full flex flex-wrap">
            {nfts?.sort(SORT_MAP[activeSelect]).map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} onProfilePage />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
