"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Textarea } from "./ui/textarea"
import {Label} from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import {useEffect, useState} from "react";
import * as React from "react";
import {useToast} from "@/components/ui/use-toast";

// This can come from your database or API.
const defaultValue = {
  id: uuidv4(),
  footnotes: [],
  number: "",
  content: {
    en: "",
    ms: "",
    ar: ""
  },
  chapter_id: "",
  chapter_name: "",
  chapter_title: {
    en: "",
    ms: "",
    ar: "ِ"
  },
  volume_id: "",
  volume_name: "",
  volume_title: {
    en: "",
    ms: "",
    ar: "ِ"
  },
  book_id: "240360e4-50b4-47a9-9506-9850b0e3bfd7",
  book_name: "sahih_muslim",
  book_title: {
    en: "",
    ms: "Sahih Muslim",
    ar: ""
  }
}

const defaultVolume = {
    id: uuidv4(),
    name: "",
    title: {
      en: "",
      ms: "",
      ar: ""
    },
    transliteration: {
      "en": "",
      "ms": ""
    },
    book_name: "sahih_muslim",
    book_title: "Sahih Muslim",
    book_id: "240360e4-50b4-47a9-9506-9850b0e3bfd7"
}

export function MuslimForm() {
  const { toast } = useToast()

  const [value, setValue] = useState(defaultValue)
  const [volume, setVolume] = useState([])
  const [newVolume, setNewVolume] = useState(defaultVolume)
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    (async function fetchVolume() {
      try {
        const response = await fetch('/get-muslim-volume', {
          method: 'GET'
        });

        if (response.ok) {
          const { data } = await response.json()
          setVolume(data)
          console.log('Get successfully');
          // Handle success
        } else {
          console.error('Error with file');
          // Handle error
        }
      } catch (error) {
        console.error('Error file:', error);
        // Handle error
      }
    })()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const response = await fetch('/add-muslim', {
        method: 'POST',
        body: JSON.stringify(value)
      });

      if (response.ok) {
        console.log('Add successfully');
        // Handle success
        setValue(defaultValue)
        setToggle(false)
        setNewVolume(defaultVolume)
      } else {
        console.error('Error with file');
        // Handle error
      }
    } catch (error) {
      console.error('Error file:', error);
      // Handle error
    }
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">Yesss</code>
        </pre>
      ),
    })
  }

  function onSelectChange(selectedVol) {
    const getVolume = volume.find(vol => selectedVol === vol.title.ms)

    setValue({ ...value, volume_id: getVolume.id, volume_title: { ...value.volume_title, ms: getVolume.title.ms, ar: getVolume.title.ar }})
  }

  function submitNewVolume(e) {
    e.preventDefault()
    setValue({ ...value, volume_id: newVolume.id, volume_title: { ...value.volume_title, ms: newVolume.title.ms, ar: newVolume.title.ar } })
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <Label htmlFor="picture">id</Label>
            <Input placeholder="" disabled value={value.id}/>
          </div>
          <div>
            <Label htmlFor="ar">Arabic</Label>
            <Textarea value={value.content.ar} onChange={(e) => setValue({ ...value, content: { ...value.content, ar: e.target.value } })}/>
          </div>
          <div>
            <Label htmlFor="ms">Malay</Label>
            <Textarea value={value.content.ms} onChange={(e) => setValue({ ...value, content: { ...value.content, ms: e.target.value } })}/>
          </div>

          {/*setValue({ ...value, volume_id: selectedVol.id, volume_title: { ...value.volume_title, ms: selectedVol.title.ms, ar: selectedVol.title.ar }})*/}
          <Select onValueChange={(selectedVol) => onSelectChange(selectedVol)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Volume" />
            </SelectTrigger>
            <SelectContent>
              {volume.length && volume.map((vol, i) => {
                return (
                  <SelectItem key={vol.id} value={vol.title.ms}>{vol.title.ms}</SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-4">
            <p className="text-sm">Volume not found? Click here to add</p>
            <Button size={"sm"} variant={"outline"} onClick={() => setToggle(true)}><p>+</p></Button>
          </div>

          { toggle && (
            <div className="space-y-4">
              <Label>Volume</Label>
              <Input placeholder="Malay" onChange={(e) => setNewVolume({ ...newVolume, title: { ...newVolume.title, ms: e.target.value }})}/>
              <Input placeholder="Arabic" onChange={(e) => setNewVolume({ ...newVolume, title: { ...newVolume.title, ar: e.target.value }})}/>
              <Input placeholder="Transliteration" onChange={(e) => setNewVolume({ ...newVolume, transliteration: { ...newVolume.transliteration, ms: e.target.value }})}/>
              <Button onClick={submitNewVolume}>Add volume</Button>
            </div>
          )}


          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div className="bg-slate-100 rounded-md p-4 overflow-scroll">
        <pre>{JSON.stringify(value, null , 2)}</pre>
      </div>
    </div>
  )
}