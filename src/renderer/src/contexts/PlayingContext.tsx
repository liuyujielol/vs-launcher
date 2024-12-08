import { createContext, useState } from "react"

interface PlayingType {
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValue: PlayingType = { playing: false, setPlaying: () => {} }

const PlayingContext = createContext<PlayingType>(defaultValue)

const PlayingProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [playing, setPlaying] = useState<boolean>(defaultValue.playing)

  return <PlayingContext.Provider value={{ playing, setPlaying }}>{children}</PlayingContext.Provider>
}

export { PlayingContext, PlayingProvider }
