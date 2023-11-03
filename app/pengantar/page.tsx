'use client'

import Image from "next/image"
import { UserNav } from "@/components/user-nav"
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import * as React from "react";
import {Button} from "@/components/ui/button";
import {useToast} from "../../components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import {PengantarForm} from "@/components/pengantar-form";
import {useRouter} from "next/navigation";

export default function PengantarPage() {
  const [fetchData, setFetchData] = useState(null)
  const [value, setValue] = useState({})
  const [index, setIndex] = useState(null)
  const textareaRef = useRef(null);
  const { toast } = useToast()
  const router = useRouter();

  useEffect(() => {
    (async function() {
      const res = await fetch(`/pengantar-api`, {
        method: 'GET',
      });

      const { data } = await res.json()
      //

      setFetchData(data)
    })()

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('input', autoResize);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('input', autoResize);
      }
    };
  }, [])

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleChange = (id, val) => {
    setValue({ id, number: Number(val), volume_id: '2b1bc287-cdea-4e51-b5d3-f6fa0ce31235\n'})
  };

  async function submitForm(e) {
    e.preventDefault()

    try {
      const response = await fetch('/pengantar-api', {
        method: 'POST',
        body: JSON.stringify(value)
      });

      if (response.ok) {
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(value, null, 2)}</code>
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

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add Hadith</h2>
            <p className="text-muted-foreground">
              Add a new muslim hadith
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        {/*<Button>Next</Button>*/}
        { fetchData && fetchData.map((data, i) => {
          return (
            <Button key={i}
                    onClick={() => {
                      router.push('#form')
                      setIndex(i)
                    }}>
              {data.number && <span className="bg-white px-4 text-black">#</span>}
              {data.content[0]?.ms.substring(0, 100)}
            </Button>
          )
        })}
        { index !== null && <PengantarForm key={index} data={fetchData[index]} index={index}/> }
        <Button>Choose</Button>
        {/*{*/}
        {/*  fetchData && (*/}
        {/*    <div className="mt-12 p-4 bg-gray-100 grid gap-2">*/}
        {/*      {fetchData.map((hadith) => {*/}
        {/*        return (*/}
        {/*          <div key={hadith._id} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"}} className="gap-12 grid p-8 bg-white shadow-sm rounded-lg">*/}
        {/*            {*/}
        {/*              hadith.content.map((c, i) => {*/}
        {/*                return (*/}
        {/*                  <div key={i} className="flex flex-col space-y-8">*/}
        {/*                    <Textarea className="h-[200px] text-lg text-justify whitespace-pre-line" value={c.ms}/>*/}
        {/*                    <Textarea dir="rtl" className="h-[200px] text-xl text-justify whitespace-pre-line" style={{ fontSize: "1.25rem"}} value={c.ar} />*/}
        {/*                  </div>*/}

        {/*                )*/}
        {/*              })*/}
        {/*            }*/}
        {/*            <Input placeholder="Number"*/}
        {/*                   type="number"*/}
        {/*                   value={hadith.number}*/}
        {/*                   onChange={(e) => handleChange(hadith._id, e.target.value)}*/}
        {/*            />*/}
        {/*            <Input placeholder="volume_id"*/}
        {/*                   value={hadith.volume_id}*/}
        {/*                   disabled*/}
        {/*            />*/}
        {/*            <Button onClick={submitForm}>Submit</Button>*/}
        {/*          </div>*/}
        {/*        )*/}
        {/*      })}*/}
        {/*    </div>*/}
        {/*  )*/}
        {/*}*/}
      </div>
    </>
  )
}