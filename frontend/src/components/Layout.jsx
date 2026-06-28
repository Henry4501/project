import { useReducer, useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/react";
import AppSidebar from "@/components/AppSidebar";
import CollectionForm from "@/components/CollectionForm";
import { apiRequest } from "@/lib/api";

const initialState = {
  collections: [],
  collectionFormOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_COLLECTIONS":
      return { ...state, collections: action.payload };
    case "ADD_COLLECTION":
      return { ...state, collections: [...state.collections, action.payload] };
    case "OPEN_COLLECTION_FORM":
      return { ...state, collectionFormOpen: true };
    case "CLOSE_COLLECTION_FORM":
      return { ...state, collectionFormOpen: false };
    default:
      return state;
  }
}

export default function Layout({ children }) {
  const { getToken } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchCollections = async () => {
      const token = await getToken();
      const data = await apiRequest("/api/collections", token);
      dispatch({ type: "SET_COLLECTIONS", payload: data });
    };
    fetchCollections();
  }, []);

  const handleCollectionCreated = (collection) => {
    dispatch({ type: "ADD_COLLECTION", payload: collection });
  };

  return (
    <SidebarProvider>
      <AppSidebar
        collections={state.collections}
        onAddCollection={() => dispatch({ type: "OPEN_COLLECTION_FORM" })}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6">{children}</main>
      </SidebarInset>

      <CollectionForm
        open={state.collectionFormOpen}
        onOpenChange={(open) =>
          dispatch({
            type: open ? "OPEN_COLLECTION_FORM" : "CLOSE_COLLECTION_FORM",
          })
        }
        onCreated={handleCollectionCreated}
      />
    </SidebarProvider>
  );
}
