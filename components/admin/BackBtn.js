import Link from "next/link"

const BackBtn = ({ href }) => (
  <Link href={href}>
    <a>
      <button className='button button-detail'>Cancel</button>
    </a>
  </Link>
)

export default BackBtn
