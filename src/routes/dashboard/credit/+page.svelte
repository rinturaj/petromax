<script lang="ts">
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { componentSide } from '../../../lib/component.store';
	import AddExpenses from '$lib/components/custom/addExpenses.svelte';
	import type { CreditModel } from '../../../database/model';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import { cn, toNumber } from '../../../lib/utils';
	import { CalendarIcon, Trash2, Check } from 'lucide-svelte';
	import Calendar from '../../../lib/components/ui/calendar/calendar.svelte';
	import AddCredit from '../../../lib/components/custom/addCredit.svelte';
	import { derived } from 'svelte/store';
	import type { DateRange } from 'bits-ui';
	import DatePickerWithRange from '../../../lib/components/custom/date-picker-with-range.svelte';

	const add = () => {
		componentSide.set(AddCredit);
	};

	let onDelete = false;
	let deleteCredit: CreditModel;

	$: creditList = liveQuery(async () => {
		// return await db.credit.where('createdOn').between(startDate, endDate).toArray();

		if (sortBy != '' && !!sortBy)
			return await db.credit
				.where('createdOn')
				.between(startDate, endDate, true, true)
				.and((x) => x.name == sortBy)
				.reverse()
				.sortBy(sortBy);
		else
			return await db.credit
				.where('createdOn')
				.between(startDate, endDate, true, true)
				.sortBy(sortBy);
	});

	$: creditListName = liveQuery(async () => {
		return [...new Set((await db.credit.toArray()).map((x) => x.name))];
	});

	$: totalCredit = $creditList
		? $creditList
				.filter((x) => x?.type === 'Credit')
				.map((x) => x.amount || 0)
				.reduce((sum, x) => (-x - sum) * -1, 0)
		: 0;
	$: totalSettled = $creditList
		? $creditList
				.filter((x) => x?.type !== 'Credit')
				.map((x: CreditModel) => x.amount || 0)
				.reduce((sum: number, x: number) => (-x - sum) * -1, 0)
		: 0;

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

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Credit Details for selected date range</Card.Title>
					<Card.Description class="max-w-lg text-balance leading-relaxed">
						Current month's stock shown. Choose earlier date for previous month's details.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button on:click={add}>Create New</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>This Month Settled</Card.Description>
					<Card.Title class="currency text-4xl text-green-700"
						>{toNumber(totalSettled || 0)}</Card.Title
					>
				</Card.Header>
				<Card.Content></Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>This Month Credit</Card.Description>
					{#if !!totalCredit}
						<Card.Title class="currency text-3xl text-red-600">{toNumber(totalCredit)}</Card.Title>
					{/if}
				</Card.Header>
				<Card.Content></Card.Content>
			</Card.Root>
		</div>
		<Tabs.Root value="week">
			<Tabs.Content value="week">
				<Card.Root>
					<Card.Header class="flex flex-row justify-between px-7">
						<div>
							<Card.Title
								>Sale Details for {df.format(
									dateValue?.start?.toDate(getLocalTimeZone()) ?? new Date()
								)} - {df.format(
									dateValue?.end?.toDate(getLocalTimeZone()) ?? new Date()
								)}</Card.Title
							>
							<Card.Description>
								Selected Date Range Sales are shown. Choose earlier date for previous month's
								details.
							</Card.Description>
						</div>
						<div class="flex">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger asChild let:builder>
									<Button variant="outline" class="mr-2  gap-1 " builders={[builder]}>
										<ListFilter class="h-3.5 w-3.5" />
										<span class="sr-only sm:not-sr-only">Filter</span>
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Label>Filter by Name</DropdownMenu.Label>
									<DropdownMenu.Separator />
									{#if !!$creditListName && $creditListName.length > 0}
										{#each $creditListName as name}
											<DropdownMenu.Item
												class={sortBy === name ? 'bg-lime-50' : ''}
												on:click={() => {
													sortBy = name == sortBy ? '' : name;
												}}
											>
												{#if sortBy === name}
													<Check />
												{/if}

												{name}</DropdownMenu.Item
											>
										{/each}
									{/if}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
							<DatePickerWithRange bind:value={dateValue} />
						</div>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head class="hidden sm:table-cell">Date</Table.Head>
									<Table.Head>Name</Table.Head>
									<Table.Head class="hidden sm:table-cell">Vehicle Number</Table.Head>
									<Table.Head class="">Type</Table.Head>
									<Table.Head class="">Amount</Table.Head>
									<Table.Head class="text-right"></Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#if !!$creditList && $creditList.length > 0}
									{#each $creditList as stock}
										<Table.Row>
											<Table.Cell class="font-medium">{df.format(stock.createdOn)}</Table.Cell>

											<Table.Cell>
												{stock.name}
												<br />
												<b>{stock.phoneNumber}</b>
											</Table.Cell>
											<Table.Cell>{stock.vehicle}</Table.Cell>
											<Table.Cell>
												<Badge class={stock.type == 'Credit' ? 'bg-red-500' : 'bg-green-500'}>
													{stock.type}
												</Badge>
											</Table.Cell>

											<Table.Cell>
												<b
													class="currency {stock.type == 'Credit'
														? 'text-red-600'
														: 'text-green-600'}"
												>
													{toNumber(stock.amount)}</b
												>
											</Table.Cell>

											<Table.Cell>
												<div class="flex items-center justify-end space-x-2">
													<Button
														on:click={() => {
															deleteCredit = stock;
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
										<Table.Cell colspan={6} class="mt-4 pt-4 text-center font-medium">
											<div class="flex flex-col items-center">
												<div class="text-2xl font-bold text-gray-700">No Credit Data Available</div>
												<p class="mt-2 text-gray-500">
													Please add some Credit data to get started.
												</p>
												<Button class="mt-3" on:click={() => add()}>Add New Credit</Button>
											</div>
										</Table.Cell>
									</Table.Row>
								{/if}
							</Table.Body>
						</Table.Root>
					</Card.Content>
					<Card.Footer class=" border bg-lime-50 pt-3 text-right">
						<div class="grid w-full grid-cols-3 gap-2">
							<div class="grid">
								<h6 class=" text-xs text-muted-foreground">Credit</h6>
								<h6 class="currency text-sm font-semibold">{toNumber(totalCredit || 0)}</h6>
							</div>
							<div class="grid">
								<h6 class=" text-xs text-muted-foreground">Settled</h6>
								<h6 class="currency text-sm font-semibold">{toNumber(totalSettled || 0)}</h6>
							</div>

							<div class="grid">
								<h6 class=" text-xs text-muted-foreground">Balance</h6>
								<h6
									class="currency text-sm font-extrabold {toNumber(totalCredit - totalSettled) >= 0
										? 'text-green-600'
										: 'text-red-600'}"
								>
									{toNumber(totalCredit - totalSettled)}
								</h6>
							</div>
						</div>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

<AlertDialog.Root bind:open={onDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete from your system.
				<p class="text-red-500">{deleteCredit.id}</p>
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
					db.credit.delete(deleteCredit.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
