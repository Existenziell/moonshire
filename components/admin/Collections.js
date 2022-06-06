import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../lib/supabase'
import { AppContext } from '../../context/AppContext'
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'

const Collections = ({ collections }) => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [fetchedCollections, setFetchedCollections] = useState()
  const [formData, setFormData] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState()

  useEffect(() => {
    setFetchedCollections(collections)
  }, [collections])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const openEdit = (id) => {
    const openBtn = document.getElementById(`${id}-openBtnCollection`)
    const closeBtn = document.getElementById(`${id}-closeBtnCollection`)
    const inputs = document.getElementsByClassName(`${id}-inputCollection`)
    const openEditBtns = document.getElementsByClassName('openBtnCollection')
    openBtn.style.display = "none"
    closeBtn.style.display = "flex"
    Array.from(openEditBtns).forEach(el => (el.disabled = true))
    Array.from(inputs).forEach(el => (el.disabled = false))
  }

  const closeEdit = (collection) => {
    const openBtn = document.getElementById(`${collection.id}-openBtnCollection`)
    const closeBtn = document.getElementById(`${collection.id}-closeBtnCollection`)
    const inputs = document.getElementsByClassName(`${collection.id}-inputCollection`)
    const openEditBtns = document.getElementsByClassName('openBtnCollection')

    openBtn.style.display = "block"
    closeBtn.style.display = "none"
    Array.from(openEditBtns).forEach(el => (el.disabled = false))
    Array.from(inputs).forEach(el => (el.disabled = true))
    setFormData({})
  }

  const editCollection = async (id) => {
    const collection = fetchedCollections.filter(c => c.id === id)[0]
    const { error } = await supabase
      .from('collections')
      .update({
        title: formData.title ? formData.title : collection.title,
        headline: formData.headline ? formData.headline : collection.headline,
        description: formData.description ? formData.description : collection.description,
        year: formData.year ? formData.year : collection.year,
      })
      .eq('id', id)

    if (!error) {
      notify("Collection updated successfully!")
      const openBtn = document.getElementById(`${id}-openBtnCollection`)
      const closeBtn = document.getElementById(`${id}-closeBtnCollection`)
      const inputs = document.getElementsByClassName(`${id}-inputCollection`)
      const openEditBtns = document.getElementsByClassName('openBtnCollection')

      openBtn.style.display = "block"
      closeBtn.style.display = "none"
      Array.from(openEditBtns).forEach(el => (el.disabled = false))
      Array.from(inputs).forEach(el => (el.disabled = true))
      setFormData({})
    }
  }

  const toggleDeleteModal = (id) => {
    setCollectionToDelete(id)
    setShowDelete(true)
  }

  const deleteCollection = async () => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionToDelete)

    if (!error) {
      notify("Collection deleted successfully!")
      setShowDelete(false)
      const filteredCollections = fetchedCollections.filter(c => { return c.id !== collectionToDelete })
      setFetchedCollections(filteredCollections)
    }
  }

  if (!fetchedCollections) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20 w-full'>
      <h2 className='mb-6'>Collections</h2>

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b border-lines dark:border-lines-dark'>
            <th>Cover</th>
            <th>Title</th>
            <th>Headline</th>
            <th>Description</th>
            <th>Year</th>
            <th className='whitespace-nowrap'># NFTs</th>
            <th>Created</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedCollections?.length &&
            <tr className='p-4 dark:text-brand'><td>No collections found.</td></tr>
          }

          {fetchedCollections?.map((collection) => (
            <tr key={collection.id + collection.title} className='relative'>
              <td>
                <Link href={`/collections/${collection.id}`}>
                  <a>
                    {collection.public_url ?
                      <img src={collection.public_url} alt='Collection Image' className='w-12' />
                      :
                      "n/a"
                    }
                  </a>
                </Link>
              </td>
              <td>
                <input
                  type='text' name='title' id='title'
                  onChange={setData} disabled required
                  defaultValue={collection.title}
                  className={`${collection.id}-inputCollection`}
                />
              </td>
              <td>
                <input
                  type='text' name='headline' id='headline'
                  onChange={setData} disabled
                  defaultValue={collection.headline}
                  className={`${collection.id}-inputCollection`}
                />
              </td>
              <td>
                <input
                  type='text' name='description' id='description'
                  onChange={setData} disabled required
                  defaultValue={collection.description}
                  className={`${collection.id}-inputCollection`}
                />
              </td>
              <td>
                <input
                  type='text' name='year' id='year'
                  onChange={setData} disabled required
                  defaultValue={collection.year}
                  className={`${collection.id}-inputCollection`}
                />
              </td>

              <td>{collection.numberOfNfts}</td>

              <td className='whitespace-nowrap'>{collection.created_at.slice(0, 10)}</td>

              <td className='text-center align-middle'>
                <div id={`${collection.id}-closeBtnCollection`} className='hidden items-center justify-center gap-2'>
                  <button onClick={() => editCollection(collection.id)} aria-label='Edit Collection' className='button-admin'>
                    Save
                  </button>
                  <button onClick={() => closeEdit(collection)} aria-label='Close Edit Dialog' className='button-admin'>
                    Cancel
                  </button>
                </div>
                <button onClick={() => openEdit(collection.id)} id={`${collection.id}-openBtnCollection`} className='openBtn button-admin' aria-label='OpenEdit Dialog'>
                  Edit
                </button>
              </td>

              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(collection.id)} aria-label='Toggle Delete Modal' className='button-admin'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete collection */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button
                onClick={() => setShowDelete(false)}
                className='absolute top-0 right-0 px-2 pb-1 rounded-sm hover:text-cta text-2xl'
                aria-label='Close Delete Dialog'
              >
                &times;
              </button>
              <p className='text-sm'>Deleting collection with ID {collectionToDelete}</p>
              <h1>Are you sure?</h1>
              <div className='flex items-center gap-4'>
                <button onClick={() => setShowDelete(false)} className='button button-detail' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteCollection} className='button button-detail' aria-label='Delete Collection'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div >
  )
}

export default Collections
