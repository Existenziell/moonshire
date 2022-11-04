import Head from "next/head";
import Image from "next/image";

export default function Help() {
  return (
    <>
      <Head>
        <title>About | Project Moonshire</title>
        <meta name='description' content="About | Project Moonshire" />
      </Head>

      <div className='max-w-2xl leading-relaxed mx-auto px-[20px] md:px-[40px]'>
        <h1 className="text-center">Help</h1>
        <p className='mb-6'>Project Moonshire backend runs on the Sepolia Network, a test network for Ethereum.</p>
        <p>You can add Sepolia to Metamask using these settings:</p>

        <div className=" bg-detail dark:bg-detail-dark px-8 py-4 mt-2 mb-8 rounded-sm font-mono max-w-max mx-auto">
          <p className="text-xl mb-4">Configuration for Sepolia:</p>
          <ul>
            <li>Name: Sepolia Test Network</li>
            <li>Network/Chain ID: 11155111</li>
            <li>RPC-Endpoint: https://rpc.sepolia.dev</li>
            <li>Explorer: <a href='https://sepolia.etherscan.io/' target='_blank' rel='noopener noreferrer nofollow' className="link-white">https://sepolia.etherscan.io/</a></li>
            <li>Consensus Engine: Proof of Stake</li>
            <li>Symbol: SepoliaETH</li>
          </ul>
        </div>
        <p>
          After adding Sepolia to Metamask you can receive free test SepoliaETH through the <a href='https://faucet.sepolia.dev/' target='_blank' rel='noopener noreferrer nofollow' className='link-white'>Sepolia faucet</a>.


        </p>
        <div className='flex items-center justify-center gap-4 mt-8'>
          <p>Find even more information<br /> about <a href='https://sepolia.dev/' target='_blank' rel='noopener noreferrer nofollow' className='link-white'>Sepolia</a></p>
          <a href='https://sepolia.dev/' target='_blank' rel='noopener noreferrer nofollow'>
            <Image src='/sepolia.webp' alt='Sepolia Dolphin' width={40} height={80} className='hover:animate-pulse' />
          </a>
        </div>
      </div>
    </>
  )
}
