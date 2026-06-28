import { useReducer } from "react";
import { useAuth } from "@clerk/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

const initialState = { name: "", loading: false };

function reducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function CollectionForm({ open, onOpenChange, onCreated }) {
  const { getToken } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async () => {
    if (!state.name.trim()) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token = await getToken();
      const collection = await apiRequest("/api/collections", token, {
        method: "POST",
        body: JSON.stringify({ name: state.name }),
      });
      onCreated(collection);
      dispatch({ type: "RESET" });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Collection name"
          value={state.name}
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={state.loading}>
            {state.loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
