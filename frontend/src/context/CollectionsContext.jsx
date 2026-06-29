// A single source of truth for the signed-in user's collections, shared by the
// sidebar, the "New Collection" dialog, and every Add Link picker.
//
// Before this existed, Layout and each page fetched collections independently,
// so creating one only updated the sidebar's copy while the Add Link dropdown
// kept a stale copy until a full page reload. Context lets all of them read the
// same list and the same updater.
// Docs: https://react.dev/reference/react/createContext
import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "@clerk/react";
import { apiRequest } from "@/lib/api";

// null default: consumers must be inside the provider (we throw below if not).
const CollectionsContext = createContext(null);

const initialState = { collections: [], loading: true };

function reducer(state, action) {
  switch (action.type) {
    case "SET_COLLECTIONS":
      return { collections: action.payload, loading: false };
    case "ADD_COLLECTION":
      return { ...state, collections: [...state.collections, action.payload] };
    default:
      return state;
  }
}

export function CollectionsProvider({ children }) {
  const { getToken } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch once when the provider mounts. It lives in ProtectedRoute, which stays
  // mounted across page navigations, so this runs once per signed-in session
  // instead of once per page.
  useEffect(() => {
    const fetchCollections = async () => {
      const token = await getToken();
      const data = await apiRequest("/api/collections", token);
      dispatch({ type: "SET_COLLECTIONS", payload: data });
    };
    fetchCollections();
  }, []);

  const value = {
    collections: state.collections,
    loading: state.loading,
    // Call this after a successful POST so every consumer (sidebar + every Add
    // Link picker) sees the new collection without a refetch.
    addCollection: (collection) =>
      dispatch({ type: "ADD_COLLECTION", payload: collection }),
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

// Convenience hook so consumers don't import useContext + the context object.
export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return ctx;
}
