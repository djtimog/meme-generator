import { Forward, Copy, ArrowDownToLine } from "lucide-react";

import { Button } from "./ui/button";

export function ImageActionButtons() {
  return (
    <div className="flex gap-3">
      <Button value="Forward" size={"icon"} aria-label="Toggle Forward">
        <Forward className="h-4 w-4" />
      </Button>
      <Button value="Copy" size={"icon"} aria-label="Toggle Copy">
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        value="strikethrough"
        size={"icon"}
        aria-label="Toggle strikethrough"
      >
        <ArrowDownToLine className="h-4 w-4" />
      </Button>
    </div>
  );
}
