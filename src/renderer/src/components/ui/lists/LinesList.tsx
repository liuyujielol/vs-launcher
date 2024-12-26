function LinesListContainer({ children }: { children: React.ReactNode }): JSX.Element {
  return <ul className="w-full flex flex-col gap-2">{children}</ul>
}

interface LinesListItemProps {
  title?: string
  selected?: boolean
  onClick?: () => void
  children: React.ReactNode
}

function LinesListItem({ title, selected = false, onClick, children }: LinesListItemProps): JSX.Element {
  return (
    <li
      title={title}
      onClick={onClick}
      className={`w-full px-2 py-1 hover:pl-3 hover:pr-1 duration-100 border-l-4 ${selected ? "border-vs bg-vs/15" : "border-transparent"} rounded cursor-pointer odd:bg-zinc-850`}
    >
      {children}
    </li>
  )
}

export { LinesListContainer, LinesListItem }
