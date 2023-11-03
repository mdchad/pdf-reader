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

let num = 0.18
export function PengantarForm({ data, index } : { data?: any, index?: any }) {
  const { toast } = useToast()
  const [value, setValue] = useState(data)

  async function onSubmit(e: any) {
    e.preventDefault()
    try {
      const response = await fetch(`/pengantar-api`, {
        method: 'PUT',
        body: JSON.stringify({ ...value, number: num })
      })
      num = parseFloat((num + 0.01).toFixed(2))

      if (response.ok) {
        console.log('Add successfully');
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
    <div className="grid grid-cols-2 gap-8" id={'form'}>
      <div>
        <form onSubmit={(e) => onSubmit(e)} className="space-y-8">
          <div>
            <Label htmlFor="ar">Number</Label>
            <Input value={value?.number} type="number" onChange={(e) => setValue({ ...value, number: Number(e.target.value) })}/>
          </div>
          {
            value?.content?.map((contentItem: any, index: any) => (
              <div key={index} className="space-y-8">
                <div>
                  <Label htmlFor="ar">Arabic</Label>
                  <Textarea value={value?.content[index].ar}
                            className="h-[150px]"
                            dir="rtl"
                            onChange={(e: any) => {
                              const updatedContent = [...value.content];
                              updatedContent[index].ar = e.target.value;
                              setValue((prevValue: any) => ({ ...prevValue, content: updatedContent }));
                            }}
                  />
                </div>
                <div>
                  <Label htmlFor="ms">Malay</Label>
                  <Textarea value={value?.content[index].ms}
                            className="h-[500px]"
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
            <Input value={value?.chapter_title?.ms} placeholder="Malay" onChange={(e) => setValue({ ...value, chapter_title: { ...value.chapter_title, ms: e.target.value } }) }/>
            <Input value={value?.chapter_title?.ar} placeholder="Arabic" onChange={(e) => setValue({ ...value, chapter_title: { ...value.chapter_title, ar: e.target.value } }) }/>
            {/*<Input value={hadith?.chapter_transliteration?.ms} placeholder="Transliteration" onChange={(e) => setValue({ ...hadith, chapter_transliteration: { ...hadith.chapter_transliteration, ms: e.target.value } }) }/>*/}
            <Textarea value={value?.chapter_metadata?.ms} placeholder="MS Metadata" onChange={(e) => setValue({ ...value, chapter_metadata: { ...value.chapter_metadata, ms: e.target.value } }) }/>
            <Textarea value={value?.chapter_metadata?.ar} placeholder="AR Metadata" onChange={(e) => setValue({ ...value, chapter_metadata: { ...value.chapter_metadata, ar: e.target.value } }) }/>
          </div>

          {/*<div className="space-y-4">*/}
          {/*  <Label>Volume</Label>*/}
            {/*<p className="text-slate-500 text-xs">Volume here will get the previously entered volume. <span className="font-bold text-red-400">Make sure to click the add volume button when adding a new volume</span></p>*/}
            {/*<Input value={value?.volume_title?.ms} placeholder="Malay"/>*/}
            {/*<Input value={value?.volume_title?.ar} placeholder="Arabic"/>*/}
            {/*<Input value={value..transliteration.ms} placeholder="Transliteration" onChange={(e) => setNewVolume({ ...newVolume, transliteration: { ...newVolume.transliteration, ms: e.target.value }})}/>*/}
            {/*<Textarea value={value.volume_title.metadata} placeholder="Metadata" onChange={(e) => setNewVolume({ ...newVolume, metadata: e.target.value })}/>*/}
          {/*</div>*/}

          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div className="bg-slate-100 rounded-md p-4 overflow-scroll">
        {/*{value && <pre>{JSON.stringify(value, null , 2)}</pre> }*/}
        <pre className="mt-2 rounded-md bg-slate-950 p-4 overflow-x-scroll">
          {value && <code className="text-white overflow-x-scroll">{JSON.stringify(value, null, 2)}</code> }
        </pre>
      </div>
    </div>
  )
}