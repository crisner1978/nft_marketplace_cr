import { Banner, CreatorCard, Loader, NFTCard, SearchBar } from "components";
import useMarketNft from "context/NFTContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import images from "../assets";
import { getTopCreators } from "utils/getTopCreators";
import { shortenAddress } from "utils/shortenAddress";

export default function Home() {
  const { fetchNFTs } = useMarketNft();
  const [isLoading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  // Creator List
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const [hideArrows, setHideArrows] = useState(false);
  const [activeSelect, setActiveSelect] = useState("Recently Added");

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items);
      setNftsCopy(items);
      setLoading(false)
    });
  }, [fetchNFTs]);
  
  const SORT_MAP = {
    'Recently Added': ((a, b) => b.tokenId - a.tokenId),
    'Price (low to high)': ((a, b) => a.price - b.price),
    'Price (high to low)': ((a, b) => b.price - a.price)
  }

  const onHandleSearch = (value) => {
    const filtered = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length) {
      setNfts(filtered);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  // Creator scrollable
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideArrows(false);
    } else {
      setHideArrows(true);
    }
  };
  // Hide Arrows or Show Arrows depending on Scrollable
  useEffect(() => {
    isScrollable();
    window.addEventListener("resize", isScrollable);
    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  }, []);
  // Scroll Creators
  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const topCreators = getTopCreators(nftsCopy).sort((a, b) => b.sum - a.sum);
  console.log("topCreators", topCreators);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          bannerText={(<>Discover, collect, and sell<br /> extraordinary NFTs</>)}
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left text-white"
        />
        {/* Top Sellers */}

        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl text-semibold ml-4 xs:ml-0">That&apos;s weird... No NFTs for sale!</h1>
        ) : isLoading ? (<Loader />) : (
          <>
          <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl text-semibold ml-4 xs:ml-0">
          Top Sellers
          </h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div
              className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
              ref={scrollRef}>
              {topCreators.map((creator, i) => (
                <CreatorCard
                  key={creator.seller}
                  rank={i + 1}
                  creatorImage={images[`creator${i + 1}`]}
                  creatorName={shortenAddress(creator.seller)}
                  creatorEths={creator.sum}
                />
              ))}
              {/* {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}`}
                  creatorEths={10 - i * 0.5}
                />
              ))} */}
              {!hideArrows && (
                <>
                  <div
                    className="absolute h-8 w-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                    onClick={() => handleScroll("left")}>
                    <Image
                      src={images.left}
                      layout="fill"
                      objectFit="contain"
                      alt="left_arrow"
                      className="filter invert dark:invert-0"
                    />
                  </div>
                  <div
                    className="absolute h-8 w-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                    onClick={() => handleScroll("right")}>
                    <Image
                      src={images.right}
                      layout="fill"
                      objectFit="contain"
                      alt="right_arrow"
                      className="filter invert dark:invert-0"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hot NFTs */}
        <div className="mt-8">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl text-semibold ">
              Hot NFTs
            </h1>
          </div>
          <div className="mt-3 flex-2 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            <SearchBar
              activeSelect={activeSelect}
              setActiveSelect={setActiveSelect}
              clearSearch={onClearSearch}
              handleSearch={onHandleSearch}
              SORT_MAP={SORT_MAP}
            />
          </div>

          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts?.sort(SORT_MAP[activeSelect]).map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
            {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <NFTCard
                key={`nft-${i}`}
                nft={{
                  i,
                  name: `Nifty NFT ${i}`,
                  price: (10 - i * 0.534).toFixed(2),
                  seller: `0x${makeId(3)}...${makeId(4)}`,
                  owner: `0x${makeId(3)}...${makeId(4)}`,
                  description: "Cool NFT on Sale",
                }}
              />
            ))} */}
          </div>
        </div>
          </>
        )}



        
      </div>
    </div>
  );
}
