import { createContext, useContext, useState } from "react"

interface PlayingContextType {
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValue: PlayingContextType = { playing: false, setPlaying: () => {} }

const PlayingContext = createContext<PlayingContextType>(defaultValue)

const PlayingProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [playing, setPlaying] = useState<boolean>(defaultValue.playing)

  return <PlayingContext.Provider value={{ playing, setPlaying }}>{children}</PlayingContext.Provider>
}

const usePlayingContext = (): PlayingContextType => {
  const context = useContext(PlayingContext)
  if (!context) {
    throw new Error("usePlayingContext must be used within an PlayingProvider")
  }
  return context
}

export { PlayingProvider, usePlayingContext }
