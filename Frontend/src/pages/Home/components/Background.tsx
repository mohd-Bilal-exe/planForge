export default function Background() {
  return (
    <div className="z-0 fixed inset-0 pointer-events-none">
      <div className="top-[-10%] left-[-5%] absolute bg-blue-600/20 blur-[120px] rounded-full w-125 h-125"></div>
      <div className="right-[-5%] bottom-[-10%] absolute bg-indigo-600/15 blur-[120px] rounded-full w-1500 h-1500"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px]"></div>
    </div>
  );
}