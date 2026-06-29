import {
  HeartIcon,
  PencilIcon,
  TrashIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/react";
import { apiRequest } from "@/lib/api";

// Displays one link. The parent passes callbacks (onUpdated/onDeleted/onEdit)
// so this card stays "dumb" about where the list lives. This is "lifting state
// up": the card reports events, the parent owns the data.
// Docs: https://react.dev/learn/sharing-state-between-components
export default function LinkCard({ link, onUpdated, onDeleted, onEdit }) {
  const { getToken } = useAuth();

  const toggleFavorite = async () => {
    const token = await getToken();
    // PATCH updates only the fields we send (here, just favorite).
    const updated = await apiRequest(`/api/links/${link.id}`, token, {
      method: "PATCH",
      body: JSON.stringify({ favorite: !link.favorite }),
    });
    onUpdated(updated);
  };

  const deleteLink = async () => {
    const token = await getToken();
    await apiRequest(`/api/links/${link.id}`, token, { method: "DELETE" });
    onDeleted(link.id);
  };

  return (
    <div className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3 min-w-0">
        {link.favicon && (
          <img
            src={link.favicon}
            alt=""
            className="mt-1 h-4 w-4 shrink-0 rounded"
          />
        )}
        <div className="min-w-0">
          <a
            href={link.url}
            target="_blank"
            // rel prevents the new tab from accessing window.opener (security).
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium hover:underline min-w-0"
          >
            {/* truncate goes on the text span, not the flex <a>: text-overflow
                only clips block text, so a flex container won't ellipsize. */}
            <span className="truncate">{link.title || link.url}</span>
            <ArrowSquareOutIcon size={14} className="shrink-0" />
          </a>
          <p className="text-sm text-muted-foreground truncate">{link.url}</p>
          {link.notes && (
            <p className="mt-1 text-sm text-muted-foreground break-words">
              {link.notes}
            </p>
          )}
          {link.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {link.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 ml-2">
        <Button size="icon" variant="ghost" onClick={toggleFavorite}>
          {/* Phosphor's weight prop swaps the outline icon for a filled one. */}
          <HeartIcon
            size={18}
            weight={link.favorite ? "fill" : "regular"}
            className={link.favorite ? "text-red-500" : ""}
          />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onEdit(link)}>
          <PencilIcon size={18} />
        </Button>
        <Button size="icon" variant="ghost" onClick={deleteLink}>
          <TrashIcon size={18} />
        </Button>
      </div>
    </div>
  );
}
