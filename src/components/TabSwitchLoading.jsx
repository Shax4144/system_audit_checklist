import { ClipboardCheck } from "lucide-react";

const ChecklistTabLoading = ({
  title = "Loading...",
  description = "Please wait while the content is being prepared.",
}) => {
  return (
    <div
      className="
           rounded-xl
           border
           bg-card
           min-h-105
           flex
           items-center
           justify-center
         "
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center px-6">
        {/* Icon */}
        <div
          className="
               flex
               items-center
               justify-center
               size-12
               rounded-xl
               bg-muted
               text-primary
               mb-5
             "
        >
          <ClipboardCheck className="size-6" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold">{title}</h3>

        {/* Description */}
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>

        {/* Animated dots */}
        <div className="flex items-center gap-1 mt-4">
          <span
            className="
                 size-1.5
                 rounded-full
                 bg-primary
                 animate-[custom-bounce_0.8s_infinite]
                 [animation-delay:-0.3s]
               "
          />
          <span
            className="
                 size-1.5
                 rounded-full
                 bg-primary
                 animate-[custom-bounce_0.8s_infinite]
                 [animation-delay:-0.15s]
               "
          />
          <span
            className="
                 size-1.5
                 rounded-full
                 bg-primary
                 animate-[custom-bounce_0.8s_infinite]
               "
          />
        </div>
      </div>
    </div>
  );
};

export default ChecklistTabLoading;
