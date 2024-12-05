import React from "react"

interface ButtonProps {
  btnType: "sm" | "md" | "lg" | "custom"
  onClick?: () => void
  className?: string
  title?: string
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ btnType, onClick, className, title, children }) => {
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
      className={`${btnStyles} p-2 flex items-center justify-center font-bold rounded text-zinc-200 shadow-md shadow-zinc-950 hover:scale-95 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${className}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

export default Button
