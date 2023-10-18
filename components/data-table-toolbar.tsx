'use client';

import { Table } from '@tanstack/react-table';
import {PlusCircle, X} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/data-table-view-options';

import { priorities, statuses } from '@/data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import * as React from "react";
import {Dialog, DialogTrigger} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import {Separator} from "@/components/ui/separator";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const [value, setValue] = useState({ en: '', ms: '', ar: ''})
	const [range, setRange] = useState<any>({
		'1': {},
		'2': {},
		'3': {},
		'4': {},
		'5': {},
		'6': {},
		'7': {},
		'8': {},
		'9': {},
		'10': {},
		'11': {},
		'12': {},
		'13': {},
		'14': {},
		'15': {},
		'16': {},
	})
	const [data, setData] = useState([])
	const [open, setOpen] = useState(false)

	const isFiltered =
		table.getPreFilteredRowModel().rows.length >
		table.getFilteredRowModel().rows.length;

	const selected = table.getRowModel().rows.map((row) => {
		if (row.getIsSelected()) {
			return row.original.id
		}
		return null
	})

	async function add(index) {
		let copyData = [...data]
		copyData[index] = {
			value: {
				...value
			},
			range: {
				...range[index + '']
			},
			valueId: uuidv4()
		}
		console.log(copyData)
		setData([...copyData])
	}

	async function onDelete() {
		try {
			const response = await fetch('/delete', {
				method: 'POST',
				body: JSON.stringify(selected.filter(s => s !== null))
			});

			if (response.ok) {
				console.log('Delete successfully');
				// Handle success
			} else {
				console.error('Error uploading file');
				// Handle error
			}
		} catch (error) {
			console.error('Error uploading file:', error);
			// Handle error
		}
	}

	async function onUpdate() {
		setOpen(false)
		const reqObj = {
			selected: selected.filter(s => s !== null),
			value,
			valueId: uuidv4(),
			range
		}

		try {
			const response = await fetch('/update', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			if (response.ok) {
				console.log('Update successfully');
				// Handle success
			} else {
				console.error('Error uploading file');
				// Handle error
			}
		} catch (error) {
			console.error('Error uploading file:', error);
			// Handle error
		}
	}

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tasks..."
					value={(table.getColumn('content')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('content')?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<Button><PlusCircle className="mr-2 h-4 w-4" />Add chapter</Button>
				<Dialog open={open} onOpenChange={() => setOpen(true)}>
					<DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add volume</Button></DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you sure absolutely sure?</DialogTitle>
							<DialogDescription>
								Add the volume to the hadith
							</DialogDescription>
						</DialogHeader>
						<p>1.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value } )}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'0'} value={range['0']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'0'} value={range['0']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[0]} onClick={() => add(0)}>Add</Button>
						<Separator className="my-4"/>
						<p>2.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'1'} value={range['1']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'1'} value={range['1']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[1]} onClick={() => add(1)}>Add</Button>
						<Separator className="my-4"/>
						<p>3.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'2'} value={range['2']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'2'} value={range['2']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button  disabled={data[2]} onClick={() => add(2)}>Add</Button>
						<Separator className="my-4"/>
						<p>4.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'3'} value={range['3']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'3'} value={range['3']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[3]} onClick={() => add(3)}>Add</Button>
						<Separator className="my-4"/>
						<p>5.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'4'} value={range['4']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'4'} value={range['4']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[4]} onClick={() => add(4)}>Add</Button>
						<Separator className="my-4"/>
						<p>6.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'5'} value={range['5']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'5'} value={range['5']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[5]} onClick={() => add(5)}>Add</Button>
						<Separator className="my-4"/>
						<p>7.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'6'} value={range['6']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'6'} value={range['6']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[6]} onClick={() => add(6)}>Add</Button>
						<Separator className="my-4"/>
						<p>8.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'7'} value={range['7']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'7'} value={range['7']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[7]} onClick={() => add(7)}>Add</Button>
						<Separator className="my-4"/>
						<p>9.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'8'} value={range['8']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'8'} value={range['8']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[8]} onClick={() => add(8)}>Add</Button>
						<Separator className="my-4"/>
						<p>10.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'9'} value={range['9']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'9'} value={range['9']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[9]} onClick={() => add(9)}>Add</Button>
						<Separator className="my-4"/>
						<p>11.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'10'} value={range['10']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'10'} value={range['10']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[10]} onClick={() => add(10)}>Add</Button>
						<Separator className="my-4"/>
						<p>12.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'11'} value={range['11']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'11'} value={range['11']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[11]} onClick={() => add(11)}>Add</Button>
						<Separator className="my-4"/>
						<p>13.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'12'} value={range['12']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'12'} value={range['12']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[12]} onClick={() => add(12)}>Add</Button>
						<Separator className="my-4"/>
						<p>14.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'13'} value={range['13']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'13'} value={range['13']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[13]} onClick={() => add(13)}>Add</Button>
						<Separator className="my-4"/>
						<p>15.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'14'} value={range['14']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'14'} value={range['14']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Separator className="my-4"/>
						<Button disabled={data[14]} onClick={() => add(14)}>Add</Button>
						<p>16.</p>
						<Input placeholder="Malay" onChange={(e) => setValue({ ...value, ms: e.target.value })}/>
						<Input placeholder="Arabic" onChange={(e) => setValue({ ...value, ar: e.target.value })}/>
						<Input placeholder="start" name={'15'} value={range['15']?.start} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], start: e.target.value } })}/>
						<Input placeholder="end" name={'15'} value={range['15']?.end} onChange={(e) => setRange({ ...range, [e.target.name]: { ...range[e.target.name], end: e.target.value } })}/>
						<Button disabled={data[15]} onClick={() => add(15)}>Add</Button>
						<Separator className="my-4"/>
						<div className="bg-slate-100 rounded-md p-4 overflow-scroll">
							<pre>{JSON.stringify(data, null , 2)}</pre>
						</div>
						<Button onClick={() => onUpdate()}>Submit</Button>
					</DialogContent>
				</Dialog>
				<Button onClick={() => onDelete()}><PlusCircle className="mr-2 h-4 w-4" />Delete</Button>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
