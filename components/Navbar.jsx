import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import images from "assets";
import { Button } from ".";
import useMarketNft from "context/NFTContext";

const checkActive = (active, setActive, router) => {
  switch(router.pathname) {
    case '/':
      if (active !== 'Explore NFTs') setActive('Explore NFTs')
      break;
    case '/listed-nfts':
      if (active !== 'Listed NFTs') setActive('Listed NFTs')
      break;
    case '/my-nfts':
      if (active !== 'My NFTs') setActive('My NFTs')
      break;
    case '/create-nfts':
      setActive('')
      break;
    default:
      setActive('')
  }
}

const Navbar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState("Explore NFTs");
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    checkActive(active, setActive, router)
  }, [active, router])

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
      {/* Left Side */}
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div className="flex items-center cursor-pointer" onClick={() => setOpen(false)}>
            <Image
              src={images.logo02}
              objectFit="contain"
              width={32}
              height={32}
              alt="logo"
            />
            <p className="md:hidden flex dark:text-white text-nft-dark-1 font-semibold text-lg ml-1">
              CryptoKet
            </p>
          </div>
        </Link>
      </div>
      {/* Dark Mode Button & Right Side Nav */}
      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            name="toggleTheme"
            id="checkbox"
            onChange={() => setTheme(theme === "light" ? "dark" : "light")}
          />
          <label
            htmlFor="checkbox"
            className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label cursor-pointer">
            <i className="fas fa-sun" /> <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup setActive={setActive} router={router} setOpen={setOpen} />
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="hidden md:flex ml-2">
        {isOpen ? (
          <Image
            src={images.cross}
            alt="close"
            objectFit="contain"
            width={20}
            height={20}
            onClick={() => setOpen(false)}
            className="filter invert dark:invert-0 cursor-pointer"
          />
        ) : (
          <Image
            src={images.menu}
            alt="menu"
            objectFit="contain"
            width={25}
            height={25}
            onClick={() => setOpen(true)}
            className="filter invert dark:invert-0 cursor-pointer"
          />
        )}
        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems isMobile active={active} setActive={setActive} setOpen={setOpen} />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
              <ButtonGroup setActive={setActive} router={router} setOpen={setOpen} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

const MenuItems = ({ isMobile, active, setActive, setOpen }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return "/";
      case 1:
        return "/listed-nfts";
      case 2:
        return "/my-nfts";
      default:
        return "/";
    }
  };

  return (
    <ul
      className={`list-none flexCenter flex-row ${
        isMobile && "flex-col h-full space-y-4"
      }`}>
      {["Explore NFTs", "Listed NFTs", "My NFTs"].map((item, i) => (
        <li
          key={i}
          onClick={() => {
            setActive(item)
            if(isMobile) setOpen(prev => !prev)
            }}
          className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${
            active === item
              ? "dark:text-white text-nft-dark-1"
              : "dark:text-nft-gray-3 text-nft-gray-2"
          }`}>
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

const ButtonGroup = ({ setActive, router, setOpen }) => {
  const { currentAccount, connectWallet } = useMarketNft();

  return currentAccount ? (
    <Button
      btnName="Create"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {
        setActive("");
        setOpen(prev => !prev)
        router.push("/create-nft");
      }}
    />
  ) : (
    <Button
      btnName="Connect"
      classStyles="mx-2 rounded-xl"
      handleClick={connectWallet}
    />
  );
};
