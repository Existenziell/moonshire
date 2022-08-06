import Head from "next/head"

export default function Download({ id }) {
  return (
    <>
      <Head >
        <title>Download | Project Moonshire</title>
        <meta name='description' content='Download | Project Moonshire' />
      </Head>

      <div className='px-[40px] w-full'>
        <h1 className="mb-0">Download Asset</h1>
        <hr className="my-8 " />
        ID: {id}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id

  return {
    props: { id },
  }
}
