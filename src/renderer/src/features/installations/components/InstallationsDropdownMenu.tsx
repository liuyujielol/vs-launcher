import { useTranslation } from "react-i18next"

import { useInstallationContext } from "@renderer/contexts/InstallationContext"
import { useInstallationsContext } from "@renderer/contexts/InstallationsContext"

import { DropdownItem, DropdownList, DropdownSelected, DropdownWrapper } from "@renderer/components/ui/inputs/Dropdown"

function InstallationsDropdownMenu({ disabled }: { disabled?: boolean }): JSX.Element {
  const { t } = useTranslation()

  const { installations } = useInstallationsContext()
  const { installation, setInstallation } = useInstallationContext()

  return (
    <DropdownWrapper openDirection="top" width="full" disabled={disabled}>
      <DropdownSelected>
        {installations.length < 1 ? (
          <>
            <span>{t("features.installations.noInstallationsAvailable")}</span>
            <span className="text-zinc-500 text-xs flex gap-1 items-center">{t("features.installations.noInstallationsAvailableSub")}</span>
          </>
        ) : (
          <>
            {!installation ? (
              <div className="w-full flex items-center justify-between">
                <span>{t("features.installations.noInstallationSelected")}</span>
                <div className="text-sm text-zinc-500 flex flex-col items-end justify-between">
                  <span>X.X.X</span>
                  <span>{t("features.mods.modsCount", { count: 0 })}</span>
                </div>
              </div>
            ) : (
              <>
                {installations.map(
                  (current) =>
                    current.id === installation.id && (
                      <div key={current.id} className="w-full flex items-center justify-between">
                        <span>{current.name}</span>
                        <div className="text-sm text-zinc-500 flex flex-col items-end justify-between">
                          <span>{current.version}</span>
                          <span>{t("features.mods.modsCount", { count: current.mods.length })}</span>
                        </div>
                      </div>
                    )
                )}
              </>
            )}
          </>
        )}
      </DropdownSelected>
      {installations.length > 0 && (
        <DropdownList>
          {installations.map((current) => (
            <DropdownItem
              key={current.id}
              onClick={() => {
                setInstallation(current)
                window.localStorage.setItem("installation", current.id)
              }}
            >
              <div className="w-full flex items-center justify-between">
                <span>{current.name}</span>
                <div className="text-sm text-zinc-500 flex flex-col items-end justify-between">
                  <span>{current.version}</span>
                  <span>{t("features.mods.modsCount", { count: current.mods.length })}</span>
                </div>
              </div>
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  )
}

export default InstallationsDropdownMenu
