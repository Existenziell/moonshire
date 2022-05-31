import Head from 'next/head'

const About = () => {
  return (
    <>
      <Head>
        <title>About | Project Moonshire</title>
        <meta name='description' content="About | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center max-w-xl text-sm text-justify leading-relaxed mx-auto'>
        <h1>About</h1>
        <p className='mb-6'>PROJECT MOONSHIRE IS A WEB3 WHITE-LABEL PLATFORM DISRUPTING THE 2.0 STATUS QUO: A CUTTING EDGE, DECENTRALISED MONETISING SERVICE FOR CONTENT CREATORS RUNNING ON THE TEZOS BLOCKCHAIN.</p>
        <p>With Project Moonshire creators are given full control of their releases offering a direct channel for their community of fans to collect and trade releases by their idols.</p>
      </div>
    </>
  )
}

export default About
