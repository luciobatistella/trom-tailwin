"use client"

import React, { useState } from "react"
import IcoCaixa from "../assets/ico-caixa.svg"
import { menuItems, dashboardSubItems } from "../components/menuItems"
import LogoSvg from "../assets/logo.svg"
import Profile from "./Profile"

export default function Sidebar({ open, onToggle, onSettingsOpen }) {
  const [openSubmenu, setOpenSubmenu] = useState(false)
  const [anchorProfile, setAnchorProfile] = useState(null)
  const handleSubmenuToggle = () => setOpenSubmenu((prev) => !prev)
  const handleProfileClick = (e) => setAnchorProfile(e.currentTarget)
  const handleProfileClose = () => setAnchorProfile(null)
  const profileOpen = Boolean(anchorProfile)

  const drawerWidth = 290

  return (
    <>
      <div
        className={`h-screen fixed top-0 left-0 flex flex-col bg-[#111] transition-all duration-300 ease-sharp ${
          open ? `w-[${drawerWidth}px]` : "w-[65px] sm:w-[73px]"
        } overflow-hidden whitespace-nowrap`}
      >
        {/* Logo + Toggle */}
        <div className={`flex items-center px-1.5 py-3 pt-6 pb-6 pl-6 pr-2 bg-[#111] ${open ? "justify-between" : "justify-end"}`}>
          {open && <img src={LogoSvg || "/placeholder.svg"} alt="Logo" className="h-8 w-auto" />}
          <button onClick={onToggle} className="text-white p-2 rounded-full hover:bg-[#333] transition-colors">
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <img src={IcoCaixa || "/placeholder.svg"} alt="Toggle" className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="border-t border-[#333]" />

        {/* Equipe Perfil */}
        <div className="bg-gradient-to-t from-[#FAA831] to-[#F58634] p-1">
          <button
            onClick={handleProfileClick}
            className="flex w-full text-white bg-[#111] bg-opacity-70 hover:bg-[#333] transition-colors duration-200 p-2"
          >
            <div className="pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 29.744 29.744">
                <path
                  d="M299.875,40a14.872,14.872,0,1,0,14.872,14.872A14.889,14.889,0,0,0,299.875,40Zm8.575,23.068v-.587c0-2.028-2.343-2.768-3.6-3.3-.454-.194-1.31-.605-2.189-1.034a1.2,1.2,0,0,1-.6-.86l-.1-.962a4.13,4.13,0,0,0,1.38-2.469h.152a.51.51,0,0,0,.5-.4l.238-1.469a.487.487,0,0,0-.5-.5c.005-.031.011-.063.015-.089a5.078,5.078,0,0,0,.06-.513c.015-.134.027-.272.033-.415a3.327,3.327,0,0,0-.286-1.64,3.884,3.884,0,0,0-.915-1.332c-1.162-1.1-2.509-1.528-3.658-.644a2.658,2.658,0,0,0-2.384,1.009,3.128,3.128,0,0,0-.693,1.4,4.449,4.449,0,0,0-.16,1.061,4.3,4.3,0,0,0,.108,1.166.491.491,0,0,0-.458.5l.237,1.469a.511.511,0,0,0,.5.4h.136a4.932,4.932,0,0,0,1.392,2.515l-.094.929a1.2,1.2,0,0,1-.6.861c-.85.415-1.686.814-2.187,1.02-1.18.486-3.6,1.276-3.6,3.3v.459a11.876,11.876,0,1,1,17.267.127Z"
                  transform="translate(-285.003 -40.003)"
                  fill="#FFF"
                />
              </svg>
            </div>
            <div className="grid text-left">
              <span className="text-xs mb-0">11105</span>
              <span className="text-sm normal-case">Equipe de Desenvolvimento</span>
            </div>
          </button>
        </div>

        {/* Main menu items */}
        <ul className="p-0">
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
              <li>
                <button
                  className="flex items-center min-h-[48px] px-2.5 text-white border-b border-[#333] w-full hover:bg-[#333] transition-colors duration-200"
                  onClick={
                    item.label === "Dashboard"
                      ? handleSubmenuToggle
                      : item.label === "Configurações"
                        ? onSettingsOpen
                        : () => {}
                  }
                >
                  <span className={`flex justify-center ${open ? "mr-3" : "mr-0"}`}>
                    <img src={item.iconSrc || "/placeholder.svg"} alt={item.label} className="w-6 h-6" />
                  </span>
                  <span className={`${open ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}>
                    {item.label}
                  </span>
                </button>
              </li>

              {/* Submenu animado */}
              {item.label === "Dashboard" && (
                <div
                  className={`${
                    open && openSubmenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  } transition-all duration-300 overflow-hidden bg-[#1e1e1e]`}
                >
                  <ul className="p-0">
                    {dashboardSubItems.map((sub) => (
                      <li key={sub.label}>
                        <button
                          className="flex items-center pl-4 min-h-[40px] text-[#ccc] border-b border-[#333] w-full hover:bg-[#222] transition-colors duration-200"
                          onClick={() => {}}
                        >
                          <span className="flex justify-center mr-3">
                            <img src={sub.iconSrc || "/placeholder.svg"} alt={sub.label} className="w-6 h-6" />
                          </span>
                          <span className="text-[#ccc]">{sub.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>

      {/* Popover do Perfil */}
      {profileOpen && (
        <div
          className="fixed z-50"
          style={{
            top: anchorProfile ? anchorProfile.getBoundingClientRect().bottom : 0,
            left: anchorProfile ? anchorProfile.getBoundingClientRect().left : 0,
          }}
        >
          <div className="bg-white shadow-lg rounded">
            <Profile />
          </div>
          <div className="fixed inset-0 z-[-1]" onClick={handleProfileClose}></div>
        </div>
      )}
    </>
  )
}
