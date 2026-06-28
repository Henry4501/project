import { useReducer, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/api";

const initialState = {
  url: "",
  notes: "",
  collectionId: "",
  tags: "",
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.payload };
    case "SET_FORM":
      return { ...state, ...action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function LinkForm({
  open,
  onOpenChange,
  onCreated,
  onUpdated,
  editLink,
  collections,
}) {
  const { getToken } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (editLink) {
      dispatch({
        type: "SET_FORM",
        payload: {
          url: editLink.url,
          notes: editLink.notes || "",
          collectionId: editLink.collectionId || "",
          tags: editLink.tags?.map((t) => t.name).join(", ") || "",
        },
      });
    } else {
      dispatch({ type: "RESET" });
    }
  }, [editLink, open]);

  const setField = (field) => (e) =>
    dispatch({ type: "SET_FIELD", field, payload: e.target.value });

  const handleSubmit = async () => {
    if (!state.url.trim()) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token = await getToken();
      const payload = {
        url: state.url,
        notes: state.notes,
        collectionId: state.collectionId || null,
        tags: state.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editLink) {
        const updated = await apiRequest(`/api/links/${editLink.id}`, token, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        onUpdated(updated);
      } else {
        const created = await apiRequest("/api/links", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        onCreated(created);
      }

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
          <DialogTitle>{editLink ? "Edit Link" : "Add Link"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="URL"
            value={state.url}
            onChange={setField("url")}
          />
          <Input
            placeholder="Notes (optional)"
            value={state.notes}
            onChange={setField("notes")}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={state.tags}
            onChange={setField("tags")}
          />
          <Select
            value={state.collectionId}
            onValueChange={(value) =>
              dispatch({
                type: "SET_FIELD",
                field: "collectionId",
                payload: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="No collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No collection</SelectItem>
              {collections?.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={state.loading}>
            {state.loading ? "Saving..." : editLink ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
