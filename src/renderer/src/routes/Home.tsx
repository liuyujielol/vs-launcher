import { useEffect, useState } from "react"
import { FiExternalLink } from "react-icons/fi"
import { useTranslation } from "react-i18next"

function Home(): JSX.Element {
  const [version, setVersion] = useState<string>("")
  const { t } = useTranslation()

  useEffect(() => {
    ;(async (): Promise<void> => {
      const res = await window.api.getVersion()
      setVersion(res)
    })()
  }, [])

  return (
    <main className="relative h-screen bg-image-1">
      <div className="w-full absolute p-1 px-4 select-none bg-gradient-to-b from-zinc-950/60 to-zinc-950/0 flex justify-between items-center text-xs text-zinc-400">
        <span className="flex flex-nowrap gap-1">
          <MiniLinks to="https://github.com/XurxoMF/vs-launcher/issues" text={t("top-minimenu-issues")} />|
          <MiniLinks to="https://github.com/XurxoMF/vs-launcher/wiki" text={t("top-minimenu-guides")} />|
          <MiniLinks to="https://github.com/XurxoMF/vs-launcher" text={t("top-minimenu-source")} />
        </span>
        <span>VS Launcher - v{version}</span>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-around p-4 pt-8 bg-zinc-900/50">
        <div className="w-full text-center flex flex-col items-center gap-2 text-lg">
          <h1 className="text-4xl font-bold">{t("page-home-title")}</h1>
          <p>{t("page-home-description")}</p>
        </div>
        <iframe
          src="https://www.youtube.com/embed/C5v8NaRVIyk?si=rSRDgrOXKYBWu-7W"
          title="Promotional Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="max-w-full max-h-full h-1/2 aspect-video rounded-md shadow-md shadow-zinc-900"
        ></iframe>
      </div>
    </main>
  )
}

export default Home

const MiniLinks = ({ to, text }: { to: string; text: string }): JSX.Element => {
  return (
    <a href={to} className="flex flex-row flex-nowrap items-center gap-1">
      {text} <FiExternalLink />
    </a>
  )
}
