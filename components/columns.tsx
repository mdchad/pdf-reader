// @ts-nocheck

'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { labels, priorities, statuses } from '@/data/data';
import { Task } from '@/data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Task>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Task" />
		),
		cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'content',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Content" />
		),
		cell: ({ row }) => {
			const label = labels.find((label: any) => label.value === row.original.label);

			return (
				<div className="flex space-x-2">
					{label && <Badge variant="outline">{label.label}</Badge>}
					<span className="max-w-[500px] truncate font-medium">
						{row.original.content.ms}
					</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'chapter',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Chapter" />
		),
		cell: ({ row }) => {
			const label = labels.find((label) => label.value === row.original.label);

			return (
				<div className="flex space-x-2">
					{label && <Badge variant="outline">{label.label}</Badge>}
					<span className="max-w-[500px] truncate font-medium">
						{row.original.chapter_title.ms}
					</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'volume',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Volume" />
		),
		cell: ({ row }) => {
			const label = labels.find((label) => label.value === row.original.label);

			return (
				<div className="flex space-x-2">
					{label && <Badge variant="outline">{label.label}</Badge>}
					<span className="max-w-[500px] truncate font-medium">
						{row.original.volume_title.ms}
					</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
