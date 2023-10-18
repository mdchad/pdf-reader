'use client';

import { Row } from '@tanstack/react-table';
import { Copy, MoreHorizontal, Pen, Star, Tags, Trash } from 'lucide-react';
import { promises as fs } from "fs"

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { labels } from '@/data/data';
import { hadithSchema } from '@/data/schema';
import path from "path";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	const task = hadithSchema.parse(row.original);

	async function deleteRow(row: Row<TData>) {

		try {
			const response = await fetch('/delete', {
				method: 'POST',
				body: JSON.stringify(row.original.id)
			});

			if (response.ok) {
				console.log('File uploaded successfully');
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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<MoreHorizontal className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem>
					<Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Make a copy
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Star className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Favorite
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Labels
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuRadioGroup value={task.label}>
							{labels.map((label) => (
								<DropdownMenuRadioItem key={label.value} value={label.value}>
									{label.label}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<button onClick={() => deleteRow(row)}>
						<Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Delete
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
