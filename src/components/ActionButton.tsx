import {
  Forward,
  Copy,
  ArrowDownToLine,
  type LucideIcon,
  Check,
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import { Button } from "./ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function ImageActionButtons({
  disabled,
  canvaRef,
}: {
  disabled?: boolean;
  canvaRef: HTMLDivElement;
}) {
  const getCanvaImageUrl = async () => {
    return await html2canvas(canvaRef, { useCORS: true }).then((canva) => {
      const dataURL = canva.toDataURL("image/png");
      return dataURL;
    });
  };

  async function urlToFile(
    url: string,
    filename: string,
    mimeType?: string
  ): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType || blob.type });
  }

  const IconStatus = [
    {
      icon: Forward,
      label: "forward",
      action: async () => {
        const canvaUrl = await getCanvaImageUrl();
        const file = await urlToFile(canvaUrl, "capture.png", "image/png");

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Shared Canvas",
              text: "Check out this image!",
            });
          } catch (err) {
            console.error("Share failed", err);
          }
        } else {
          alert("Web Share API not supported in this browser.");
        }
      },
    },
    {
      icon: Copy,
      label: "copy-file",
      action: async () => {
        const canvaUrl = await getCanvaImageUrl();
        const file = await urlToFile(canvaUrl, "capture.png", "image/png");

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [file.type]: file,
            }),
          ]);
        } catch (err) {
          console.error("Clipboard copy failed", err);
          alert("Clipboard file copy not supported in this browser.");
        }
      },
    },
    {
      icon: ArrowDownToLine,
      label: "download",
      action: async () => {
        const canvaUrl = await getCanvaImageUrl();
        const link = document.createElement("a");
        link.href = canvaUrl;
        link.download = "capture.png";
        link.click();
      },
    },
  ];

  return (
    <div className="flex gap-3">
      {IconStatus.map((icon) => (
        <IconButton key={icon.label} icon={icon} disabled={disabled} />
      ))}
    </div>
  );
}

const IconButton = ({
  icon,
  disabled,
}: {
  icon: {
    icon: LucideIcon;
    label: string;
    action: () => Promise<void>;
  };
  disabled?: boolean;
}) => {
  const [iconStatus, setIconStatus] = useState<"Initial" | "Pending" | "Final">(
    "Initial"
  );

  const handleClick = async (action: () => Promise<void>) => {
    setIconStatus("Pending");
    await action();
    setIconStatus("Final");

    clearTimeout(setTimeout(() => setIconStatus("Initial"), 2000));
  };

  return (
    <Button
      disabled={disabled || iconStatus === "Pending"}
      value={icon.label}
      size={"icon"}
      onClick={() => handleClick(icon.action)}
      aria-label={`Toggle ${icon.label}`}
    >
      {iconStatus === "Final" ? (
        <Check className="h-4 w-4" />
      ) : iconStatus === "Pending" ? (
        <Spinner />
      ) : (
        <icon.icon className="h-4 w-4" />
      )}
    </Button>
  );
};
