import Head from 'next/head'

const About = () => {
  return (
    <>
      <Head>
        <title>About | Project Moonshire</title>
        <meta name='description' content="About | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center max-w-2xl text-justify leading-relaxed mx-auto px-[20px] md:px-[40px]'>
        <h1>Web3 SaaS Provider</h1>
        <p className='mb-6'>Project Moonshire is a web3 white-label platform disrupting the 2.0 status quo: A cutting edge, decentralised monetising service for content creators running on the Blockchain.</p>
        <p>With Project Moonshire creators are given full control of their releases offering a direct channel for their community of fans to collect and trade releases by their idols.</p>
      </div>

      <div className='md:max-w-6xl leading-relaxed mx-auto px-[20px] md:px-[40px]'>
        <h1 className='mx-auto w-max mt-20 mb-12 '>Who we are</h1>
        <div>
          <div className='xs:flex gap-8 items-start justify-center'>
            <img src='/team/andi.png' alt='Andreas' width='200' className='flex-shrink-0' />
            <div>
              <h2>Andreas Rothaug <span className='text-sm'>*1986</span></h2>
              <p className='mb-4'>Designer, media artist, entrepreneur</p>
              <p className='mb-4'>Pioneer in the field of Human Computer Interaction, Creative Technologies and Computational Art</p>
              <p className='mb-4'>Early web explorer since the late 1990s</p>
              <p className='mb-4'>Has worked with golden record artists, top 100 rated agencies and indie-clients alike between Paris, Hamburg and Copenhagen</p>
              <a href='https://www.linkedin.com/in/rothaug/' target='_blank' rel='noopener noreferrer nofollow' className='link flex'>
                &#8594; LinkedIn
              </a>
            </div>
          </div>
          <div className='xs:flex gap-8 items-start justify-center mt-16'>
            <img src='/team/joi.png' alt='Joi' width='200' className='flex-shrink-0' />
            <div>
              <h2>Joi Samuels <span className='text-sm'>*1970</span></h2>
              <p className='mb-4'>Creative free spirit</p>
              <p className='mb-4'>Possesses profound know-how in the field of &quot;digital&quot;</p>
              <p className='mb-4'>Supports and advises various start-ups in building their brand and business model and was founder and CCO of a top 100 listed digital creative agency in Germany</p>
              <p className='mb-4'>Develops various premium/luxury brands for the markets of Europe / Asia / and the USA as a partner of Sensorium Luxury KGaA</p>
              <a href='https://www.linkedin.com/in/joi-samuels-864535a3/' target='_blank' rel='noopener noreferrer nofollow' className='link flex'>
                &#8594; LinkedIn
              </a>
            </div>
          </div>
          <div className='xs:flex gap-8 items-start justify-center mt-16'>
            <img src='/team/chris.png' alt='Chris' width='200' className='flex-shrink-0' />
            <div>
              <h2>Christof Bauer <span className='text-sm'>*1980</span></h2>
              <p className='mb-4'>Developer for more than 20 years</p>
              <p className='mb-4'>Digital nomad, has been traveling around the world for half a decade</p>
              <p className='mb-4'>Relentless optimist, philanthropist and outdoorsman</p>
              <p className='mb-4'>Speaks 4 non-programming languages</p>
              <a href='https://www.linkedin.com/in/christofbauer/' target='_blank' rel='noopener noreferrer nofollow' className='link flex'>
                &#8594; LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
