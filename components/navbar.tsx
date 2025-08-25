import Image from "next/image";

export default function Navbar() {
  return (
    <div className="absolute w-11/12 text-lg sm:text-xl flex justify-between items-center top-2 sm:top-3 left-1/2 -translate-x-1/2 z-40">
      <a href="https://x.com/shresth_ji76019" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={36} height={36} className="rounded object-contain" />
      </a>
    </div>
  );
}
