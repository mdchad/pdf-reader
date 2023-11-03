'use client'

import {Toaster} from "@/components/ui/toaster";

export default function PengantarLayout({children}: { children: React.ReactNode }) {
  return <>
    <div>{children}</div>
    <Toaster />
  </>
}