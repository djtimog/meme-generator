import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import { ImageActionButtons } from "./components/ActionButton";
import { Button } from "./components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Rnd } from "react-rnd";
import { Input } from "./components/ui/input";
import { RgbaColorPicker, HexColorPicker } from "react-colorful";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}
type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type Styles = {
  color?: string;
  backgroundColor?: Color;
  fontWeight?: FontWeight;
  width?: string;
  height?: string;
  fontSize?: string;
};

type Text = {
  id: number;
  content: string;
  styles?: Styles;
  position: {
    x: number;
    y: number;
  };
};
const FONT_WEIGHTS = [
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const;

const FONT_SIZES = [
  { label: "XS", value: "var(--text-xs)" },
  { label: "SM", value: "var(--text-sm)" },
  { label: "BASE", value: "var(--text-base)" },
  { label: "LG", value: "var(--text-lg)" },
  { label: "XL", value: "var(--text-xl)" },
  { label: "2XL", value: "var(--text-2xl)" },
  { label: "3XL", value: "var(--text-3xl)" },
  { label: "4XL", value: "var(--text-4xl)" },
  { label: "5XL", value: "var(--text-5xl)" },
];

function App() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [memes, setMemes] = useState<Meme[] | null>(null);
  const [selectedMemeUrl, setSelectedMemeUrl] = useState<string | null>(null);
  const canvaRef = useRef<HTMLDivElement | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);

  const selectedText = texts.find((text) => text.id === selectedTextId);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        setMemes(data.data.memes);
        setSelectedMemeUrl(data.data.memes ? data.data.memes[0].url : null);
      });
  }, []);

  const toggleMemeImage = () => {
    const randomIndex = Math.floor(Math.random() * (memes ? memes.length : 1));
    if (memes) {
      setSelectedMemeUrl(memes[randomIndex].url);
    }
  };

  const addText = () => {
    const newText: Text = {
      id: Date.now(),
      content: "Edit me",
      position: { x: 50, y: 50 },
      styles: {
        fontWeight: "700",
        fontSize: "var(--text-xl)",
        color: "black",
      },
    };
    setTexts([...texts, newText]);
  };

  const updateText = (id: number, newProps: Partial<Text>) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, ...newProps } : t)));
  };

  const deleteText = (id: number) => {
    setTexts((prev) => prev.filter((item) => item.id !== id));
    setSelectedTextId(null);
  };

  const changeStyle = (colorObject: Styles, textId: number | null) => {
    if (textId === null) return;

    const target = texts.find((t) => t.id === textId);
    const newStyles =
      target && target.styles
        ? { ...target.styles, ...colorObject }
        : { ...colorObject };

    updateText(textId, {
      styles: newStyles,
    });
  };

  const colorConverter = (color: Color | undefined) => {
    if (!color) return;
    const { r, g, b, a } = color;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const objectURL = URL.createObjectURL(file);
    setSelectedMemeUrl(objectURL);
  };

  return (
    <>
      <Header />
      <main className="">
        <section className="m-10 text-center space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-15 ">
            <div className="w-full bg-violet-100 dark:bg-violet-900 flex justify-center items-center p-5 rounded-sm overflow-hidden">
              {selectedMemeUrl ? (
                <div
                  ref={canvaRef}
                  className="border-violet-300 border-3 max-w-sm rounded-sm overflow-hidden relative text-white"
                >
                  <img
                    src={selectedMemeUrl || "https://i.imgflip.com/1bij.jpg"}
                    alt={"Meme Image"}
                    crossOrigin="anonymous"
                    className="object-contain h-full w-full"
                  />
                  {texts.map((item) => (
                    <Rnd
                      bounds="parent"
                      key={item.id}
                      default={{
                        x: item.position.x,
                        y: item.position.y,
                        width: 150,
                        height: 50,
                      }}
                      onDragStop={(_, { x, y }) => {
                        setSelectedTextId(item.id);
                        return updateText(item.id, { position: { x, y } });
                      }}
                      onResizeStop={(_, __, ref, ___, pos) => {
                        setSelectedTextId(item.id);

                        updateText(item.id, {
                          styles: {
                            width: ref.style.width,
                            height: ref.style.height,
                          },
                          ...pos,
                        });
                      }}
                    >
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          updateText(item.id, {
                            content: e.target.innerText,
                          });
                        }}
                        onFocus={() => setSelectedTextId(item.id)}
                        onClick={() => setSelectedTextId(item.id)}
                        style={{
                          ...item.styles,
                          backgroundColor: colorConverter(
                            item.styles?.backgroundColor
                          ),
                        }}
                      >
                        {item.content}
                      </p>
                    </Rnd>
                  ))}
                </div>
              ) : (
                <div className="border-violet-300 border-3 max-w-sm rounded-sm overflow-hidden relative">
                  <Skeleton className="h-60 w-96" />
                </div>
              )}
            </div>

            <div className="p-5 space-y-10">
              <div>
                <h4 className="mb-5 font-bold text-xl">
                  Select or Upload Your Image
                </h4>
                <div className="flex w-full justify-center items-end gap-5">
                  <div className="w-full space-y-2">
                    <Label htmlFor="picture">Picture</Label>
                    <Input
                      id="picture"
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <Button onClick={toggleMemeImage}>Toggle Meme Image</Button>
                </div>
              </div>

              <div className="space-y-5">
                <Button onClick={addText} className="w-full">
                  Add Text
                </Button>

                {selectedTextId !== null && (
                  <>
                    <Input
                      type="text"
                      name="content"
                      value={selectedText?.content}
                      onChange={(e) =>
                        setTexts((prevTexts) =>
                          prevTexts.map((text) =>
                            text.id === selectedTextId
                              ? { ...text, content: e.target.value }
                              : text
                          )
                        )
                      }
                      disabled={!selectedTextId && texts.length === 0}
                    />

                    <div className="flex flex-wrap gap-10 justify-between items-center">
                      <div className="w-full space-y-2">
                        <Label htmlFor="color">Text Color</Label>
                        <HexColorPicker
                          id="color"
                          color={selectedText?.styles?.color}
                          onChange={(color) =>
                            changeStyle({ color }, selectedTextId)
                          }
                        />
                      </div>

                      <div className="w-full space-y-2">
                        <Label htmlFor="bgColor">Text Background Color</Label>
                        <RgbaColorPicker
                          id="bgColor"
                          color={selectedText?.styles?.backgroundColor}
                          onChange={(color) =>
                            changeStyle(
                              { backgroundColor: color },
                              selectedTextId
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-7 items-end flex-wrap">
                      <div className="space-y-2">
                        <Label>Font Weight</Label>

                        <Select
                          value={selectedText?.styles?.fontWeight ?? "400"}
                          onValueChange={(value) =>
                            changeStyle(
                              { fontWeight: value as FontWeight },
                              selectedTextId
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select Weight" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Weights</SelectLabel>
                              {FONT_WEIGHTS.map((weight) => (
                                <SelectItem key={weight} value={weight}>
                                  {weight}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size</Label>

                        <Select
                          value={
                            selectedText?.styles?.fontSize ?? "var(--text-base)"
                          }
                          onValueChange={(value) =>
                            changeStyle({ fontSize: value }, selectedTextId)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Sizes</SelectLabel>
                              {FONT_SIZES.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {canvaRef.current && (
                        <ImageActionButtons
                          canvaRef={canvaRef.current}
                          disabled={texts.length === 0}
                        />
                      )}
                    </div>

                    <Button
                      onClick={() => deleteText(selectedTextId)}
                      className="bg-red-500 hover:bg-red-400 w-full"
                    >
                      Delete Text
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
