// Shared shell for every signed-in page: the sidebar plus a header bar.
// It owns the create-collection dialog; the collections list itself comes from
// the shared CollectionsContext so the sidebar and the Add Link picker stay in
// sync.

// useReducer groups related state and its transitions into one place. Prefer it
// over several useState calls when updates are related or the next state depends
// on the previous one.
// Docs: https://react.dev/reference/react/useReducer
import { useReducer } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import AppSidebar from "@/components/AppSidebar";
import CollectionForm from "@/components/CollectionForm";
import { useCollections } from "@/context/CollectionsContext";

const initialState = {
  collectionFormOpen: false,
};

// A reducer is a pure function (state, action) -> newState. Each action type
// describes one kind of update. We always return a NEW object (immutability)
// so React detects the change and re-renders.
function reducer(state, action) {
  switch (action.type) {
    case "OPEN_COLLECTION_FORM":
      return { ...state, collectionFormOpen: true };
    case "CLOSE_COLLECTION_FORM":
      return { ...state, collectionFormOpen: false };
    default:
      return state;
  }
}

export default function Layout({ children }) {
  // The shared list (and its updater) live in context, so creating a collection
  // here is immediately visible everywhere that reads useCollections().
  const { collections, addCollection } = useCollections();
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SidebarProvider>
      <AppSidebar
        collections={collections}
        onAddCollection={() => dispatch({ type: "OPEN_COLLECTION_FORM" })}
      />
      {/* SidebarInset is the main content area beside the sidebar. */}
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
          {/* Toggles the sidebar (also works with Ctrl/Cmd+B). */}
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
        </header>
        {/* children is whatever page wrapped itself in <Layout>. */}
        <main className="flex flex-1 flex-col gap-4 p-6">{children}</main>
      </SidebarInset>

      <CollectionForm
        open={state.collectionFormOpen}
        onOpenChange={(open) =>
          dispatch({
            type: open ? "OPEN_COLLECTION_FORM" : "CLOSE_COLLECTION_FORM",
          })
        }
        onCreated={(collection) => addCollection(collection)}
      />
    </SidebarProvider>
  );
}
