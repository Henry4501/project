import { useReducer, useEffect } from "react";

// useParams reads dynamic segments from the URL (the :id in /collections/:id).
// Docs: https://reactrouter.com/start/declarative/routing
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import Layout from "@/components/Layout";
import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useCollections } from "@/context/CollectionsContext";

const initialState = {
  links: [],
  linkFormOpen: false,
  editLink: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, links: action.links };
    case "ADD_LINK":
      return { ...state, links: [action.payload, ...state.links] };
    case "UPDATE_LINK":
      return {
        ...state,
        links: state.links.map((l) =>
          l.id === action.payload.id ? action.payload : l,
        ),
      };
    case "DELETE_LINK":
      return {
        ...state,
        links: state.links.filter((l) => l.id !== action.payload),
      };
    case "OPEN_FORM":
      return { ...state, linkFormOpen: true, editLink: action.payload || null };
    case "CLOSE_FORM":
      return { ...state, linkFormOpen: false, editLink: null };
    default:
      return state;
  }
}

export default function Collection() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { collections } = useCollections();
  const [state, dispatch] = useReducer(reducer, initialState);

  // This collection's record (for the heading) is derived from the shared list,
  // so it stays correct without its own fetch or state.
  const collection = collections.find((c) => c.id === id) || null;

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      // ?collectionId filters links to just this collection.
      const links = await apiRequest(`/api/links?collectionId=${id}`, token);
      dispatch({ type: "SET_DATA", links });
    };
    fetchData();
    // Re-run when id changes, so navigating between collections refetches.
  }, [id]);

  return (
    <Layout>
      <div className="flex items-center justify-between">
        {/* ?? falls back to "Collection" until the name has loaded. */}
        <h1 className="text-2xl font-semibold">
          {collection?.name ?? "Collection"}
        </h1>
        <Button onClick={() => dispatch({ type: "OPEN_FORM" })}>
          Add Link
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {state.links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onUpdated={(updated) =>
              dispatch({ type: "UPDATE_LINK", payload: updated })
            }
            onDeleted={(id) => dispatch({ type: "DELETE_LINK", payload: id })}
            onEdit={(link) => dispatch({ type: "OPEN_FORM", payload: link })}
          />
        ))}
        {state.links.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No links in this collection.
          </p>
        )}
      </div>

      <LinkForm
        open={state.linkFormOpen}
        onOpenChange={(open) =>
          dispatch({ type: open ? "OPEN_FORM" : "CLOSE_FORM" })
        }
        onCreated={(link) => dispatch({ type: "ADD_LINK", payload: link })}
        onUpdated={(link) => dispatch({ type: "UPDATE_LINK", payload: link })}
        editLink={state.editLink}
        collections={collections}
      />
    </Layout>
  );
}
