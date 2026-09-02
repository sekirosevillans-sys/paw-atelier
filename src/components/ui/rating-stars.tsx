import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number; // 0 to 5 (e.g. 4.8)
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  reviewsCount?: number;
  className?: string;
  onRate?: (rating: number) => void;
  interactive?: boolean;
}

export function RatingStars({
  rating,
  maxStars = 5,
  size = "md",
  showNumber = false,
  reviewsCount,
  className,
  onRate,
  interactive = false,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const currentDisplayRating = hoverRating ?? rating;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= Math.round(currentDisplayRating);

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => onRate && onRate(starNumber)}
              onMouseEnter={() => interactive && setHoverRating(starNumber)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                "transition-transform",
                interactive && "cursor-pointer hover:scale-110",
                !interactive && "cursor-default"
              )}
              aria-label={`${starNumber} estrellas de 5`}
            >
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-stone-200 text-stone-200"
                )}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}

      {typeof reviewsCount === "number" && (
        <span className="text-xs text-muted-foreground">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
