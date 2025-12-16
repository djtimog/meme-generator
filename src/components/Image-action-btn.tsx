import { Forward, Copy, ArrowDownToLine, Share } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState<boolean[]>([false, false, false]);

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

  const handleClick = async (action: () => Promise<void>, index: number) => {
    setIsLoading((loadingsPrev) =>
      loadingsPrev.map((loading, i) => (i === index ? true : loading))
    );
    await action();
    setIsLoading((loadingsPrev) =>
      loadingsPrev.map((loading, i) => (i === index ? false : loading))
    );
  };

  return (
    <div className="flex gap-3">
      {IconStatus.map((icon, index) => (
        <Button
          key={icon.label}
          disabled={disabled || isLoading[index]}
          value={icon.label}
          size={"icon"}
          onClick={() => handleClick(icon.action, index)}
          aria-label={`Toggle ${icon.label}`}
        >
          {isLoading[index] ? <Spinner /> : <icon.icon className="h-4 w-4" />}
        </Button>
      ))}
    </div>
  );
}
