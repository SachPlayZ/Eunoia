import Image from "next/image"

export default function Background() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-blue-50 relative overflow-hidden flex-col justify-center items-center">
      <Image src="/calm-background.jpg" alt="Calming background" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-blue-200 bg-opacity-30 backdrop-filter backdrop-blur-sm"></div>
      <div className="z-10 text-center p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Eunoia</h1>
        <p className="text-xl text-white">
          Join our community of mental health professionals and make a difference in peoples lives.
        </p>
      </div>
    </div>
  )
}

