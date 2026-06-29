import { useReducer, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { PencilIcon, TrashIcon, Plus, Tag, X, Check } from "@phosphor-icons/react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

const initialState = {
  tags: [],
  loading: true,
  editingTagId: null,
  editingTagName: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TAGS":
      return { ...state, tags: action.payload, loading: false };
    case "ADD_TAG":
      return { ...state, tags: [...state.tags, action.payload] };
    case "UPDATE_TAG":
      return {
        ...state,
        tags: state.tags.map((t) => (t.id === action.payload.id ? action.payload : t)),
        editingTagId: null,
        editingTagName: "",
      };
    case "DELETE_TAG":
      return {
        ...state,
        tags: state.tags.filter((t) => t.id !== action.payload),
      };
    case "START_EDITING":
      return {
        ...state,
        editingTagId: action.payload.id,
        editingTagName: action.payload.name,
      };
    case "SET_EDITING_NAME":
      return { ...state, editingTagName: action.payload };
    case "CANCEL_EDITING":
      return { ...state, editingTagId: null, editingTagName: "" };
    default:
      return state;
  }
}

export default function Tags() {
  const { getToken } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState(null);

  const fetchTags = async () => {
    try {
      const token = await getToken();
      const tags = await apiRequest("/api/tags", token);
      dispatch({ type: "SET_TAGS", payload: tags });
    } catch (err) {
      setError("Failed to load tags");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const token = await getToken();
      const created = await apiRequest("/api/tags", token, {
        method: "POST",
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      dispatch({ type: "ADD_TAG", payload: created });
      setNewTagName("");
      setError(null);
    } catch (err) {
      setError("Failed to create tag");
      console.error(err);
    }
  };

  const handleUpdateTag = async (id) => {
    if (!state.editingTagName.trim()) return;

    try {
      const token = await getToken();
      const updated = await apiRequest(`/api/tags/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ name: state.editingTagName.trim() }),
      });
      dispatch({ type: "UPDATE_TAG", payload: updated });
      setError(null);
    } catch (err) {
      setError("Failed to update tag");
      console.error(err);
    }
  };

  const handleDeleteTag = async (id) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const token = await getToken();
      await apiRequest(`/api/tags/${id}`, token, { method: "DELETE" });
      dispatch({ type: "DELETE_TAG", payload: id });
      setError(null);
    } catch (err) {
      setError("Failed to delete tag");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tags</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage tags to organize your links.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreateTag} className="flex gap-2 max-w-md mt-4">
        <Input
          placeholder="New tag name..."
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Plus size={16} className="mr-1" /> Add Tag
        </Button>
      </form>

      {error && (
        <p className="text-sm text-red-500 font-medium mt-2">{error}</p>
      )}

      <div className="mt-6">
        {state.loading ? (
          <p className="text-sm text-muted-foreground">Loading tags...</p>
        ) : state.tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags created yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
              >
                {state.editingTagId === tag.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={state.editingTagName}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_EDITING_NAME",
                          payload: e.target.value,
                        })
                      }
                      className="h-8 flex-1"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleUpdateTag(tag.id)}
                    >
                      <Check size={18} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => dispatch({ type: "CANCEL_EDITING" })}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag size={18} className="text-muted-foreground shrink-0" />
                      <span className="font-medium truncate">{tag.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 ml-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          dispatch({ type: "START_EDITING", payload: tag })
                        }
                      >
                        <PencilIcon size={18} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <TrashIcon size={18} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
