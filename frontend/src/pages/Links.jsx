import { useReducer, useEffect } from 'react'
import { useAuth } from '@clerk/react'
import Layout from '@/components/Layout'
import LinkCard from '@/components/LinkCard'
import LinkForm from '@/components/LinkForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiRequest } from '@/lib/api'
import { useCollections } from '@/context/CollectionsContext'

// Same pattern as Dashboard, plus a search field.
const initialState = {
  links: [],
  search: '',
  linkFormOpen: false,
  editLink: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, links: action.links }
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'ADD_LINK':
      return { ...state, links: [action.payload, ...state.links] }
    case 'UPDATE_LINK':
      return { ...state, links: state.links.map((l) => l.id === action.payload.id ? action.payload : l) }
    case 'DELETE_LINK':
      return { ...state, links: state.links.filter((l) => l.id !== action.payload) }
    case 'OPEN_FORM':
      return { ...state, linkFormOpen: true, editLink: action.payload || null }
    case 'CLOSE_FORM':
      return { ...state, linkFormOpen: false, editLink: null }
    default:
      return state
  }
}

export default function Links() {
  const { getToken } = useAuth()
  const { collections } = useCollections()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      const links = await apiRequest('/api/links', token)
      dispatch({ type: 'SET_DATA', links })
    }
    fetchData()
  }, [])

  // Filtering happens on the client over the already-fetched list. Derived from
  // state, so it recomputes on every keystroke without extra state.
  const filtered = state.links.filter((l) => {
    const q = state.search.toLowerCase()
    return (
      l.title?.toLowerCase().includes(q) ||
      l.url.toLowerCase().includes(q) ||
      l.tags?.some((t) => t.name.toLowerCase().includes(q))
    )
  })

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Links</h1>
        <Button onClick={() => dispatch({ type: 'OPEN_FORM' })}>Add Link</Button>
      </div>

      <Input
        placeholder="Search by title, URL or tag..."
        value={state.search}
        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
        className="max-w-sm"
      />

      <div className="flex flex-col gap-3">
        {filtered.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onUpdated={(updated) => dispatch({ type: 'UPDATE_LINK', payload: updated })}
            onDeleted={(id) => dispatch({ type: 'DELETE_LINK', payload: id })}
            onEdit={(link) => dispatch({ type: 'OPEN_FORM', payload: link })}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No links found.</p>
        )}
      </div>

      <LinkForm
        open={state.linkFormOpen}
        onOpenChange={(open) => dispatch({ type: open ? 'OPEN_FORM' : 'CLOSE_FORM' })}
        onCreated={(link) => dispatch({ type: 'ADD_LINK', payload: link })}
        onUpdated={(link) => dispatch({ type: 'UPDATE_LINK', payload: link })}
        editLink={state.editLink}
        collections={collections}
      />
    </Layout>
  )
}
