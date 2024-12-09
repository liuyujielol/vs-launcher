import { useTranslation } from "react-i18next"

function Mods(): JSX.Element {
  const { t } = useTranslation()

  return (
    <main className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-3xl">{t("page-general-notReadyYet")}</h1>
      <p>{t("page-general-comeBackLater")}</p>
    </main>
  )
}

export default Mods
