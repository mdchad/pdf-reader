import { promises as fs1 } from "fs"
const fs = require('fs');
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { UserNav } from "@/components/user-nav"
import { hadithSchema } from "@/data/schema"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs1.readFile(
    path.join(process.cwd(), "data-source/nasai.json")
  )

  const tasks = JSON.parse(data.toString())

  return { dataTable: z.array(hadithSchema).parse(tasks), tasks }
}

function findMissingNumber(sortedArray: any) {
  const missingNumbers = [];
  const corruptedNumbers = [];
  const arrayLength = sortedArray.length;

  // if (arrayLength >= expectedCount) {
  //   console.log("Array length is equal to or exceeds the expected count.");
  //   return missingNumbers;
  // }

  let currentNumber = parseInt(sortedArray[0].number);

  for (let i = 1; i < arrayLength; i++) {

    let nextNumber = parseInt(sortedArray[i].number);

    if (nextNumber - currentNumber !== 1) {
      for (let j = currentNumber + 1; j < nextNumber; j++) {
        missingNumbers.push(j);
      }
    }

    if (sortedArray[i].number === null) {
      nextNumber = currentNumber + 1
      corruptedNumbers.push(currentNumber + 1)
    }

    currentNumber = nextNumber;
  }

  return [missingNumbers, corruptedNumbers];
}

function getFiles(dir: any, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  return fileList
}

export default async function TaskPage() {
  const { dataTable, tasks } = await getTasks()

  const fileList = getFiles('./data-source')

  const [missingNumbers, corruptedNumbers] = findMissingNumber(tasks);
  console.log(missingNumbers)

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
        {/*<DataTable data={dataTable as any} dataList={fileList} corruptedNumbers={corruptedNumbers.join(', ')} missingData={missingNumbers.join(', ')} columns={columns} />*/}
      </div>
    </>
  )
}