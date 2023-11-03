"use client"

import { Button } from "./ui/button"
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
  footnotes: [],
  number: "",
  content: [{
    en: "",
    ms: "",
    ar: ""
  }],
  chapter_id: "",
  chapter_name: "",
  chapter_metadata: "",
  chapter_title: {
    en: "",
    ms: "",
    ar: ""
  },
  chapter_transliteration: {
    en: "",
    ms: "",
  },
  volume_id: "",
  volume_name: "",
  volume_title: {
    en: "",
    ms: "",
    ar: ""
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
      en: "",
      ms: ""
    },
    metadata: "",
    book_name: "sahih_muslim",
    book_title: "Sahih Muslim",
    book_id: "240360e4-50b4-47a9-9506-9850b0e3bfd7"
}

export function MuslimForm({ data, volumeData, edit = false } : { data?: any, volumeData?: any, edit?: boolean }) {
  const { toast } = useToast()

  const [value, setValue] = useState(data ? data : defaultValue)
  const [newVolume, setNewVolume] = useState( volumeData ? volumeData : defaultVolume)

  async function onSubmit(e: any) {
    e.preventDefault()

    try {
      delete value._id
      const response = edit ? await fetch(`/muslim-api/${data.number}`, {
        method: 'PUT',
        body: JSON.stringify(value)
      }) : await fetch('/muslim-api', { method: 'POST', body: JSON.stringify(value) })

      if (response.ok) {
        console.log('Add successfully');
        let previousChapter = {
          chapter_id: value.chapter_id,
          chapter_metadata: value.chapter_metadata,
          chapter_name: value.chapter_name,
          chapter_transliteration: value.chapter_transliteration,
          chapter_title: value.chapter_title,
        }
        // Handle success
        if (!edit) {
          setValue({ ...defaultValue, content: [{ en: "", ms: "", ar: "" }], ...previousChapter, volume_id: newVolume.id, volume_title: { en: newVolume.title.en , ms: newVolume.title.ms, ar: newVolume.title.ar }})
          setNewVolume(defaultVolume)
        }
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
          {value && <code className="text-white">{JSON.stringify(value, null, 2)}</code> }
        </pre>
      ),
    })
  }

  async function submitNewVolume(e: any) {
    e.preventDefault()
    setValue({ ...value, volume_id: newVolume.id, volume_title: { ...value.volume_title, ms: newVolume.title.ms, ar: newVolume.title.ar } })

    try {
      const response = await fetch('/volume-muslim', {
        method: 'POST',
        body: JSON.stringify(newVolume)
      });

      if (response.ok) {
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              {newVolume && <code className="text-white">{JSON.stringify(newVolume, null, 2)}</code> }
            </pre>
          ),
        })
        console.log('Add successfully');
        // Handle success
      } else {
        console.error('Error with file');
        // Handle error
      }
    } catch (error) {
      console.error('Error file:', error);
      // Handle error
    }
  }

  const addNewHadith = (e: any) => {
    e.preventDefault()
    // Append a new content object to the content array
    setValue((prevValue: any) => ({
      ...prevValue,
      content: [...prevValue.content, { en: "", ms: "", ar: "" }]
    }));
  }

  const removeHadith = (index: any) => {
    // Filter out the content object at the given index
    const updatedContent = value.content.filter((_: any, i: any) => i !== index);

    // Update the state
    setValue((prevValue: any) => ({ ...prevValue, content: updatedContent }));
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <Label htmlFor="ar">Number</Label>
            <Input value={value.number} onChange={(e) => setValue({ ...value, number: e.target.value })}/>
          </div>
          {
            value.content.map((contentItem: any, index: any) => (
              <div key={index} className="space-y-8">
                <div>
                  <Label htmlFor="ar">Arabic</Label>
                  <Textarea value={value.content[index].ar}
                            onChange={(e: any) => {
                              const updatedContent = [...value.content];
                              updatedContent[index].ar = e.target.value;
                              setValue((prevValue: any) => ({ ...prevValue, content: updatedContent }));
                            }}
                  />
                </div>
                <div>
                  <Label htmlFor="ms">Malay</Label>
                  <Textarea value={value.content[index].ms}
                            onChange={(e: any) => {
                              const updatedContent = [...value.content];
                              updatedContent[index].ms = e.target.value;
                              setValue((prevValue: any) => ({ ...prevValue, content: updatedContent }));
                            }}
                  />
                </div>
                <div className="flex justify-end items-center">
                  { index > 0 && <Button onClick={() => removeHadith(index)} size={'sm'} className="bg-red-500 text-white hover:bg-red-700">- Remove hadith</Button> }
                </div>
                <hr className="h-[2px] bg-gray-500"/>
              </div>
          ))}

          <div className="space-y-2">
            <p className="text-slate-500 text-xs">This add hadith button will add a new set of inputs. This is for duplicate hadith numbers</p>
            <Button onClick={(e: any) => addNewHadith(e)} size={'sm'}>+ Add hadith</Button>
          </div>

          {/*setValue({ ...value, volume_id: selectedVol.id, volume_title: { ...value.volume_title, ms: selectedVol.title.ms, ar: selectedVol.title.ar }})*/}
          {/*<Select onValueChange={(selectedVol) => onSelectChange(selectedVol)}>*/}
          {/*  <SelectTrigger className="w-[180px]">*/}
          {/*    <SelectValue placeholder="Volume" />*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent>*/}
          {/*    {volume?.length && volume.map((vol, i) => {*/}
          {/*      return (*/}
          {/*        <SelectItem key={vol.id} value={vol.title.ms}>{vol.title.ms}</SelectItem>*/}
          {/*      )*/}
          {/*    })}*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}

          {/*<div className="flex items-center space-x-4">*/}
          {/*  <p className="text-xs">Volume not found? Click here to add</p>*/}
          {/*  <Button size={"sm"} variant={"outline"} onClick={(e) => {*/}
          {/*    e.preventDefault()*/}
          {/*    setToggle(true)}}>*/}
          {/*    <p>+</p>*/}
          {/*  </Button>*/}
          {/*</div>*/}

          <div className="space-y-4">
            <Label>Chapter</Label>
            <p className="text-slate-500 text-xs">Chapter here will get the previously entered volume</p>
            <Input value={value.chapter_title.ms} placeholder="Malay" onChange={(e) => setValue({ ...value, chapter_title: { ...value.chapter_title, ms: e.target.value } }) }/>
            <Input value={value.chapter_title.ar} placeholder="Arabic" onChange={(e) => setValue({ ...value, chapter_title: { ...value.chapter_title, ar: e.target.value } }) }/>
            <Input value={value.chapter_transliteration.ms} placeholder="Transliteration" onChange={(e) => setValue({ ...value, chapter_transliteration: { ...value.chapter_transliteration, ms: e.target.value } }) }/>
            <Textarea value={value.chapter_metadata} placeholder="Metadata" onChange={(e) => setValue({ ...value, chapter_metadata: e.target.value }) }/>
          </div>

          <div className="space-y-4">
            <Label>Volume</Label>
            <p className="text-slate-500 text-xs">Volume here will get the previously entered volume. <span className="font-bold text-red-400">Make sure to click the add volume button when adding a new volume</span></p>
            <Input value={newVolume.title.ms} placeholder="Malay" onChange={(e) => setNewVolume({ ...newVolume, title: { ...newVolume.title, ms: e.target.value }})}/>
            <Input value={newVolume.title.ar} placeholder="Arabic" onChange={(e) => setNewVolume({ ...newVolume, title: { ...newVolume.title, ar: e.target.value }})}/>
            <Input value={newVolume.transliteration.ms} placeholder="Transliteration" onChange={(e) => setNewVolume({ ...newVolume, transliteration: { ...newVolume.transliteration, ms: e.target.value }})}/>
            <Textarea value={newVolume.metadata} placeholder="Metadata" onChange={(e) => setNewVolume({ ...newVolume, metadata: e.target.value })}/>
            <Button className="" size={'sm'} variant={'outline'} onClick={submitNewVolume}>Add volume</Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div className="bg-slate-100 rounded-md p-4 overflow-scroll">
        {/*{value && <pre>{JSON.stringify(value, null , 2)}</pre> }*/}
        <pre className="mt-2 rounded-md bg-slate-950 p-4">
          {value && <code className="text-white">{JSON.stringify(value, null, 2)}</code> }
        </pre>
      </div>
    </div>
  )
}