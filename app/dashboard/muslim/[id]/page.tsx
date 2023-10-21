'use client'

import Image from "next/image"
import { UserNav } from "@/components/user-nav"
import {MuslimForm} from "@/components/muslim-form";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";

export default function MuslimScreen() {
  const [fetchData, setFetchData] = useState()
  const params = useParams()
  const id = params.id

  useEffect(() => {
    (async function() {
      const res = await fetch(`/muslim-api/${id}`, {
        method: 'GET',
      });

      const { data } = await res.json()

      setFetchData(data)
    })()
  }, [])

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        { fetchData && <MuslimForm data={fetchData}/> }
      </div>
    </>
  )
}