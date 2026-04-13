import { Link } from "react-router-dom"

export default function Logo({ size = "2xl" }) {
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl"
  }

  return (
    <Link
      to={'/'}
      className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all`}
    >
      Master Sales
    </Link>
  )
}
