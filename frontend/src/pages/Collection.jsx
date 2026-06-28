import { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import Layout from "@/components/Layout";
import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

const initialState = {
  links: [],
  collections: [],
  collection: null,
  linkFormOpen: false,
  editLink: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        links: action.links,
        collections: action.collections,
        collection: action.collection,
      };
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
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      const [links, collections] = await Promise.all([
        apiRequest(`/api/links?collectionId=${id}`, token),
        apiRequest("/api/collections", token),
      ]);
      dispatch({
        type: "SET_DATA",
        links,
        collections,
        collection: collections.find((c) => c.id === id) || null,
      });
    };
    fetchData();
  }, [id]);

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {state.collection?.name ?? "Collection"}
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
        collections={state.collections}
      />
    </Layout>
  );
}
