import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import { ImageActionButtons } from "./components/Image-action-btn";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

function App() {
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  const [memes, setMemes] = useState<Meme[] | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const canvaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        setMemes(data.data.memes);
        setSelectedMeme(data.data.memes ? data.data.memes[0] : null);
      });
  }, []);

  const toggleMemeImage = () => {
    const randomIndex = Math.floor(Math.random() * (memes ? memes.length : 1));
    if (memes) {
      setSelectedMeme(memes[randomIndex]);
    }
  };

  return (
    <>
      <Header />
      <main className="">
        <form className="max-w-4xl m-auto flex items-center justify-between p-10 gap-15">
          <label className="flex-1 flex flex-col gap-2">
            <p className="font-bold">Top Text</p>
            <Input
              type="text"
              placeholder="E.g.,Lies We Tell Ourselves"
              aria-placeholder="The text that stays above the meme image"
              title="topText"
              name="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="flex-1 h-40"
            />
          </label>

          <label className="flex-1 flex flex-col gap-2">
            <p className="font-bold">Bottom Text</p>
            <Input
              type="text"
              placeholder="E.g.,Lies We Tell Ourselves"
              aria-placeholder="The text that stays below the meme image"
              title="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              name="bottomText"
              className="flex-1"
            />
          </label>
        </form>

        <section className="flex flex-col justify-center items-center gap-7 mb-10">
          <Button onClick={toggleMemeImage}>Toggle Meme Image</Button>

          {selectedMeme ? (
            <>
              <div
                ref={canvaRef}
                className="border-violet-300 border-3 max-w-sm rounded-sm overflow-hidden relative text-white text-shadow-sm text-shadow-violet-500"
              >
                <p className="absolute top-0 z-50 text-center font-extrabold text-3xl w-full">
                  {topText}
                </p>

                <p className="absolute bottom-0 text-center z-50 font-extrabold text-3xl w-full">
                  {bottomText}
                </p>

                <img
                  src={selectedMeme.url || "https://i.imgflip.com/1bij.jpg"}
                  alt={selectedMeme.name || "Meme Image"}
                  crossOrigin="anonymous"
                  className="object-contain h-full w-full"
                />
              </div>

              {canvaRef.current && (
                <ImageActionButtons
                  disabled={!topText || !bottomText}
                  canvaRef={canvaRef.current}
                />
              )}
            </>
          ) : (
            <>
              <div className="border-violet-300 border-3 max-w-sm rounded-sm overflow-hidden relative text-white">
                <Skeleton className="h-60 w-96" />
              </div>

              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="size-7" />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
