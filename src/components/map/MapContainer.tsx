import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Reusable animated/glass container for map surfaces
const MapContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-xl border border-border bg-card/70 backdrop-blur-sm shadow-md animate-fade-in",
        className
      )}
      {...props}
    />
  )
);

MapContainer.displayName = "MapContainer";

export default MapContainer;
