"use client"

import { usePathname } from "next/navigation"
import FooterFull from "@/components/FooterFull"
import FooterMini from "@/components/FooterMini"

export default function FooterSwitcher() {
  const pathname = usePathname()
  const showFullFooter = ["/", "/login", "/register", "/dashboard"].includes(pathname)
  return showFullFooter ? <FooterFull /> : <FooterMini />
}
