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

export default function LinkCard({ link, onUpdated, onDeleted, onEdit }) {
  const { getToken } = useAuth();

  const toggleFavorite = async () => {
    const token = await getToken();
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
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium hover:underline truncate"
          >
            {link.title || link.url}
            <ArrowSquareOutIcon size={14} className="shrink-0" />
          </a>
          <p className="text-sm text-muted-foreground truncate">{link.url}</p>
          {link.notes && (
            <p className="mt-1 text-sm text-muted-foreground">{link.notes}</p>
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
