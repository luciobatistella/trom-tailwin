"use client"

const getCurrentDateTime = () => {
  const now = new Date()
  const pad = (num) => String(num).padStart(2, "0")

  const day = pad(now.getDate())
  const month = pad(now.getMonth() + 1)
  const year = now.getFullYear()
  const hours = pad(now.getHours())
  const minutes = pad(now.getMinutes())
  const seconds = pad(now.getSeconds())

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

const LastUpdate = ({ total = "" }) => {
  const currentDate = getCurrentDateTime()

  return (
    <div className="pt-1">
      <div className="text-left text-xs text-[#bbb] flex leading-none mr-1">
        Últ. Atualização: <span className="font-bold">  {currentDate}</span>
      </div>
    </div>
  )
}

export default LastUpdate
