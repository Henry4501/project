import { useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import { LinkIcon, HeartIcon, FolderIcon } from "@phosphor-icons/react";
import { useAuth } from "@clerk/react";
import Layout from "@/components/Layout";
import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

const initialState = {
  links: [],
  collections: [],
  linkFormOpen: false,
  editLink: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, links: action.links, collections: action.collections };
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

export default function Dashboard() {
  const { getToken } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      const [links, collections] = await Promise.all([
        apiRequest("/api/links", token),
        apiRequest("/api/collections", token),
      ]);
      dispatch({ type: "SET_DATA", links, collections });
    };
    fetchData();
  }, []);

  const recent = state.links.slice(0, 5);
  const stats = [
    {
      label: "Total Links",
      value: state.links.length,
      icon: LinkIcon,
      to: "/links",
    },
    {
      label: "Favorites",
      value: state.links.filter((l) => l.favorite).length,
      icon: HeartIcon,
      to: "/favorites",
    },
    {
      label: "Collections",
      value: state.collections.length,
      icon: FolderIcon,
      to: null,
    },
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button onClick={() => dispatch({ type: "OPEN_FORM" })}>
          Add Link
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <div key={label} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon size={16} />
              <span className="text-sm">{label}</span>
            </div>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {to && (
              <Link
                to={to}
                className="mt-1 text-sm text-primary hover:underline"
              >
                View all
              </Link>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Recently Added</h2>
        <div className="flex flex-col gap-3">
          {recent.map((link) => (
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
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No links yet. Add your first one!
            </p>
          )}
        </div>
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
