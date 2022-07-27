import useMarketNft from "context/NFTContext";
import React from "react";

const Input = ({ inputType, title, placeholder, handleChange }) => {
  const { nftCurrency } = useMarketNft()
  return (
    <div className="mt-10 w-full">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
        {title}
      </p>
      {inputType === "number" ? (
        <div className="flexBetween flex-row dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3">
          <input type="number" className="flex w-full dark:bg-nft-black-1 bg-white outline-none" placeholder={placeholder} onChange={handleChange} />
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">{nftCurrency}</p>
        </div>
      ) : inputType === "textarea" ? (
        <textarea rows={10} placeholder={placeholder} onChange={handleChange} className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3" />
      ) : (
        <input
          type="text"
          className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
          placeholder={placeholder}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default Input;
