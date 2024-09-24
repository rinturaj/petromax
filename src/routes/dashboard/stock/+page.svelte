<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Card from '../../../lib/components/ui/card';

	import Adduser from '../../../lib/components/custom/adduser.svelte';
	import type { PageData } from './$types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Stock } from '../../../database/model';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import Switch from '../../../lib/components/ui/switch/switch.svelte';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import { Trash2 } from 'lucide-svelte';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Badge from '../../../lib/components/ui/badge/badge.svelte';
	import DatePickerWithRange from '../../../lib/components/custom/date-picker-with-range.svelte';
	import type { DateRange } from 'bits-ui';

	let onDelete = false;
	let deleteStock: Stock;
	$: stockList = liveQuery(async () => {
		return await db.stock.where('stockDate').between(startDate, endDate).toArray();
	});
	async function updateStock(stock: Stock) {
		// await db.Stock.update(stock.id, { status: stock.status });
	}

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	let dateValue: DateRange;
	let sortBy: string = '';
	let sortDesc: boolean = false;

	$: startDate =
		dateValue != null && dateValue.start != null
			? dateValue.start?.toDate(getLocalTimeZone())
			: new Date();
	$: endDate =
		dateValue != null && dateValue.end != null
			? dateValue.end?.toDate(getLocalTimeZone())
			: new Date();
</script>

<Card.Root class="w-100">
	<Card.Header class="flex flex-row items-center justify-between align-middle ">
		<div>
			<Card.Title class="">Stock Details</Card.Title>
			<p class="text-sm text-muted-foreground">
				Current month's stock shown. Choose earlier date for previous month's details.
			</p>
		</div>

		<DatePickerWithRange bind:value={dateValue} />
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Date</Table.Head>
					<Table.Head>Item</Table.Head>
					<Table.Head>Opening Stock</Table.Head>
					<Table.Head>Dip Stock</Table.Head>
					<Table.Head>Closing Stock</Table.Head>
					<Table.Head>Closing Stock(Auto)</Table.Head>
					<Table.Head>Discrepancy</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if !!$stockList && $stockList.length > 0}
					{#each $stockList as stock}
						<Table.Row>
							<Table.Cell class="font-medium">{df.format(stock.stockDate)}</Table.Cell>
							<Table.Cell>
								<Badge class={stock.type == 'diesel' ? 'bg-green-500' : 'bg-blue-500'}>
									{stock.type}
								</Badge>
							</Table.Cell>
							<Table.Cell>{stock.openingStock}</Table.Cell>
							<Table.Cell>{stock.dipStock}</Table.Cell>
							<Table.Cell>{stock.closingStock}</Table.Cell>
							<Table.Cell>0</Table.Cell>
							<Table.Cell>0</Table.Cell>
							<Table.Cell>
								<div class="flex items-center justify-end space-x-2">
									<Button
										on:click={() => {
											deleteStock = stock;
											onDelete = true;
										}}
										variant="ghost"
									>
										<Trash2 class="h-4 w-4 text-red-600" />
									</Button>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={8} class="mt-4 pt-4 text-center font-medium"
							>No stock data available for the selected period
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
<AlertDialog.Root bind:open={onDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete from your system.
				<p class="text-red-500">{deleteStock.id}</p>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					onDelete = false;
				}}>Cancel</AlertDialog.Cancel
			>
			<AlertDialog.Action
				on:click={() => {
					db.stock.delete(deleteStock.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
