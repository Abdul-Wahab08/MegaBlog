import React from 'react'

function Button({
  children,
  type = "button",
  bgColor = "bg-blue-400",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <div>
      <button className={`px-4 py-2 hover:bg-[#7bb8fc] transition cursor-pointer duration-200 rounded-lg ${className} ${bgColor} ${textColor}`} {...props}>
        {children}
      </button>
    </div>
  )
}

export default Button
