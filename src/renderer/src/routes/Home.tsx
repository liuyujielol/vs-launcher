import icon from "@assets/icon.png"

function Home(): JSX.Element {
  return (
    <main className="relative flex flex-col h-screen bg-image-1 p-4 gap-4">
      <div className="w-full h-1/3 flex justify-around">
        <figure className="h-full">
          <img src={icon} alt="Vintage Story Logo" className="h-full shadow-image" />
        </figure>
        <iframe
          src="https://www.youtube.com/embed/C5v8NaRVIyk?si=rSRDgrOXKYBWu-7W"
          title="Promotional Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full aspect-video rounded-md shadow-md shadow-zinc-900"
        ></iframe>
      </div>
      <div className="w-full h-2/3"></div>
    </main>
  )
}

export default Home
