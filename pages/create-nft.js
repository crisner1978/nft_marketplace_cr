import { Button, Input } from "components";
import useMarketNft from "context/NFTContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import images from "../assets";

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const { createNFT, uploadToIPFS } = useMarketNft()
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  // file types accepted
  const accept = {
    'image/gif': ['.gif'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/svg+xml': ['.svg'],
    'image/webp': ['.webp'],
  }

  const onDrop = useCallback(async(acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0])
    setFileUrl(url)
  }, [uploadToIPFS]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept,
    isDragReject, } = useDropzone({ onDrop, accept, maxSize: 5000000 });

  const fileStyle = useMemo(
    () =>
      `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive} && 'border-file-active'
    ${isDragAccept} && 'border-file-accept'
    ${isDragReject} && 'border-file-reject'
    `,
    [isDragActive, isDragAccept, isDragReject]
  );

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl text-semibold">
          Create New NFT
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload File
          </p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBP Max 100mb.
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    alt="file upload"
                    width={100}
                    height={100}
                    className="filter invert dark:invert-0"
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  or Browse media on your device
                </p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div className="relative h-96 w-96">
                  <Image src={fileUrl} alt="asset_file" layout="fill" />
                </div>
              </aside>
            )}
          </div>
        </div>

        <Input
          inputType="input"
          title="Name"
          placeholder="NFT Name"
          handleChange={(e) => setFormInput({...formInput, name: e.target.value})}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="NFT Description"
          handleChange={(e) => setFormInput({...formInput, description: e.target.value})}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleChange={(e) => setFormInput({...formInput, price: e.target.value})}
        />
        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create NFT"
            classStyles="rounded-xl"
            handleClick={() => createNFT(formInput, fileUrl, router)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
