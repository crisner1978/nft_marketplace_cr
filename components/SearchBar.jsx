/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Image from "next/image";
import images from "..//assets";

const SearchBar = ({ activeSelect, setActiveSelect, handleSearch, clearSearch, SORT_MAP }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(debouncedSearch)
    }, 1000)
    return () => clearTimeout(timer)
  }, [debouncedSearch])

  useEffect(() => {
    if (search) {
      handleSearch(search)
    } else {
      clearSearch()
    }
  }, [search])

  const SORT_NAMES = Object.keys(SORT_MAP)

  return (
    <>
      <div className="flex flex-1 items-center justify-center dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md px-4 py-3">
        <Image
          src={images.search}
          objectFit="contain"
          width={20}
          height={20}
          alt="search"
          className="filter invert dark:invert-0"
        />
        <input
          type="text"
          placeholder="Search NFTs here..."
          className="dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-normal text-xs outline-none"
          onChange={(e) => setDebouncedSearch(e.target.value)}
          value={debouncedSearch}
        />
      </div>
      <div
        onClick={() => setToggle((prev) => !prev)}
        className="relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md px-4 py-3">
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs">
          {activeSelect}
        </p>
        <Image
          src={images.arrow}
          objectFit="contain"
          width={15}
          height={15}
          alt="arrow"
          className="filter invert dark:invert-0"
        />
        {toggle && (
          <div className="absolute top-full right-0 left-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 py-3 px-4 rounded-md">
            {SORT_NAMES.map((option, i) => (
              <p onClick={() => setActiveSelect(option)}
                className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs my-3 cursor-pointer dark:hover:text-nft-red-violet"
                key={i}>
                {option}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
