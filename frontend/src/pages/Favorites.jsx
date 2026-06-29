import { useReducer, useEffect } from "react";
import { useAuth } from "@clerk/react";
import Layout from "@/components/Layout";
import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
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
    case "UPDATE_LINK":
      // On this page, un-favoriting should drop the link from view; otherwise
      // just update it in place.
      return {
        ...state,
        links: action.payload.favorite
          ? state.links.map((l) =>
              l.id === action.payload.id ? action.payload : l,
            )
          : state.links.filter((l) => l.id !== action.payload.id),
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

export default function Favorites() {
  const { getToken } = useAuth();
  const { collections } = useCollections();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      // The ?favorite=true query tells the API to return only favorites.
      const links = await apiRequest("/api/links?favorite=true", token);
      dispatch({ type: "SET_DATA", links });
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Favorites</h1>

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
          <p className="text-sm text-muted-foreground">No favorites yet.</p>
        )}
      </div>

      <LinkForm
        open={state.linkFormOpen}
        onOpenChange={(open) =>
          dispatch({ type: open ? "OPEN_FORM" : "CLOSE_FORM" })
        }
        onCreated={() => {}}
        onUpdated={(link) => dispatch({ type: "UPDATE_LINK", payload: link })}
        editLink={state.editLink}
        collections={collections}
      />
    </Layout>
  );
}
