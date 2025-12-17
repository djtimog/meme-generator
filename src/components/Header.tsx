import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="bg-violet-500 ">
      <div className="container p-3 flex justify-between md:px-10 mx-auto">
        <div className="flex justify-center items-center gap-3">
          <img src="logo.png" alt="This is the app Logo" className="size-10" />
          <p className="font-bold text-2xl">MemeForger</p>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
