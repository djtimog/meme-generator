import Header from "./components/Header";
import { ImageActionButtons } from "./components/Image-action-btn";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  const data = {
    success: true,
    data: {
      memes: [
        {
          id: "61579",
          name: "One Does Not Simply",
          url: "https://i.imgflip.com/1bij.jpg",
          width: 568,
          height: 335,
          box_count: 2,
        },
        {
          id: "101470",
          name: "Ancient Aliens",
          url: "https://i.imgflip.com/26am.jpg",
          width: 500,
          height: 437,
          box_count: 2,
        },
        // probably a lot more memes here..
      ],
    },
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
              name="bottomText"
              className="flex-1"
            />
          </label>
        </form>
        <section className="flex flex-col justify-center items-center gap-7">
          <Button>Toggle Meme Image</Button>
          <div className="border-violet-300 border-3 max-w-sm rounded-sm overflow-hidden relative text-white">
            <p className="absolute top-2 z-50 text-center font-extrabold text-2xl w-full">
              This for the image
            </p>
            <p className="absolute bottom-2 text-center z-50 font-extrabold text-2xl w-full">
              This for the image
            </p>
            <img
              src={data.data.memes[0].url}
              alt={data.data.memes[0].name}
              className="object-contain h-full w-full"
            />
          </div>
          <ImageActionButtons />
        </section>
      </main>
    </>
  );
}

export default App;
