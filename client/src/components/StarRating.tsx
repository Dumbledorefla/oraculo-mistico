/**
 * StarRating Component - Reusable star rating component
 */

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  showValue = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const index = i + 1;
        const isFilled = index <= displayRating;
        const isHalfFilled = !isFilled && index - 0.5 <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(index)}
            onMouseEnter={() => interactive && setHoverRating(index)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-yellow-500 text-yellow-500"
                  : isHalfFilled
                  ? "fill-yellow-400/50 text-yellow-400/50"
                  : "fill-transparent text-gray-500"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  isLoading?: boolean;
  title?: string;
}

export function ReviewForm({ onSubmit, isLoading, title = "Deixe sua avaliação" }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Sua nota</label>
        <StarRating
          rating={rating}
          interactive
          onChange={setRating}
          size="lg"
        />
        {rating === 0 && (
          <p className="text-xs text-gray-500">Clique nas estrelas para avaliar</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Comentário (opcional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte sua experiência..."
          className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isLoading}
        className={cn(
          "w-full py-3 rounded-lg font-medium transition-colors",
          rating > 0
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        )}
      >
        {isLoading ? "✨ Enviando sua avaliação..." : "Enviar Avaliação"}
      </button>
    </form>
  );
}

interface ReviewCardProps {
  userName: string;
  rating: number;
  comment?: string;
  date: string;
  avatarUrl?: string;
}

export function ReviewCard({ userName, rating, comment, date, avatarUrl }: ReviewCardProps) {
  return (
    <div className="bg-gray-800/30 border border-purple-500/10 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-medium">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="w-full h-full rounded-full object-cover" />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">{userName}</span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          <StarRating rating={rating} size="sm" className="mt-1" />
          {comment && (
            <p className="text-gray-400 text-sm mt-2">{comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
