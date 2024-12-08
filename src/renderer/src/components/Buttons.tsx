import React from "react"

interface ButtonProps {
  btnType: "sm" | "md" | "lg" | "custom"
  onClick?: () => void
  className?: string
  title?: string
  disabled?: boolean
  children: React.ReactNode
}

function Button({ btnType, onClick, className, title, disabled, children }: ButtonProps): JSX.Element {
  let btnStyles = ""

  switch (btnType) {
    case "sm":
      btnStyles = "w-7 h-7"
      break
    case "md":
      btnStyles = "w-16 h-16"
      break
    case "lg":
      btnStyles = "w-32 h-16"
      break
    case "custom":
      btnStyles = ""
      break
    default:
      btnStyles = "w-16 h-16"
  }

  return (
    <button
      className={`${btnStyles} p-2 flex items-center justify-center font-bold rounded shadow-md shadow-zinc-950 hover:scale-95 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 disabled:shadow-none disabled:opacity-50 ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
