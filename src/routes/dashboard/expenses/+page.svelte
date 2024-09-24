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
	import type { CreditModel, Expenses } from '../../../database/model';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import { cn } from '../../../lib/utils';
	import { CalendarIcon, Trash2 } from 'lucide-svelte';
	import Calendar from '../../../lib/components/ui/calendar/calendar.svelte';
	import AddCredit from '../../../lib/components/custom/addCredit.svelte';
	import { derived } from 'svelte/store';
	import type { DateRange } from 'bits-ui';
	import DatePickerWithRange from '../../../lib/components/custom/date-picker-with-range.svelte';

	const add = () => {
		componentSide.set(AddExpenses);
	};

	let onDelete = false;
	let deleteExp: Expenses;

	$: expenList = liveQuery(async () => {
		return await db.expenses.where('createdOn').between(startDate, endDate).toArray();
	});

	$: totalMonth = $expenList
		? $expenList.map((x) => x.amount || 0).reduce((sum, x) => (-x - sum) * -1, 0)
		: 0;
	$: totalDay = $expenList
		? $expenList
				.filter((x) => x.createdOn.getDate() == new Date().getDate())
				.map((x) => x.amount || 0)
				.reduce((sum: number, x: number) => (-x - sum) * -1, 0)
		: 0;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	let dateValue: DateRange;
	let sortBy: string = 'salesDate';
	let sortDesc: boolean;

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
					<Card.Title>Your Expenses</Card.Title>
				</Card.Header>
				<Card.Footer>
					<Button on:click={add}>Create New Expenses</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Today's</Card.Description>
					<Card.Title class="currency text-4xl">{totalDay || 0}</Card.Title>
				</Card.Header>
				<!-- <Card.Content>
					<div class="text-xs text-muted-foreground">+25% from last week</div>
				</Card.Content> -->
				<!-- <Card.Footer>
					<Progress value={25} aria-label="25% increase" />
				</Card.Footer> -->
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>This Month</Card.Description>
					<Card.Title class="currency text-3xl">{totalMonth || 0}</Card.Title>
				</Card.Header>
				<!-- <Card.Content>
					<div class="text-xs text-muted-foreground">+10% from last month</div>
				</Card.Content>
				<Card.Footer>
					<Progress value={12} aria-label="12% increase" />
				</Card.Footer> -->
			</Card.Root>
		</div>
		<Tabs.Root value="week">
			<Tabs.Content value="week">
				<Card.Root>
					<Card.Header class="flex flex-row justify-between px-7 ">
						<div>
							<Card.Title
								>Expenses Details for {df.format(
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
						<div>
							<DatePickerWithRange bind:value={dateValue} />
						</div>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head class="hidden sm:table-cell">Title</Table.Head>
									<Table.Head class="hidden sm:table-cell">Note</Table.Head>
									<Table.Head>Date</Table.Head>

									<Table.Head class="">Amount</Table.Head>
									<Table.Head class="text-right"></Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#if !!$expenList && $expenList.length > 0}
									{#each $expenList as exp}
										<Table.Row class="bg-accent">
											<Table.Cell>
												<div class="font-medium">{exp.title}</div>
											</Table.Cell>
											<Table.Cell class="hidden sm:table-cell">{exp.note}</Table.Cell>
											<Table.Cell class="hidden sm:table-cell"
												>{df.format(exp.createdOn)}</Table.Cell
											>
											<Table.Cell class="currency font-bold">{exp.amount}</Table.Cell>
											<Table.Cell>
												<div class="flex items-center justify-end space-x-2">
													<Button
														on:click={() => {
															deleteExp = exp;
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
										<Table.Cell colspan={4} class="mt-4 pt-4 text-center font-medium">
											<div class="flex flex-col items-center">
												<div class="text-2xl font-bold text-gray-700">
													No Expenses Data Available
												</div>
												<p class="mt-2 text-gray-500">
													Please add some Expenses data to get started.
												</p>
												<Button class="mt-3" on:click={() => add()}>Add New Expenses</Button>
											</div>
										</Table.Cell>
									</Table.Row>
								{/if}
							</Table.Body>
						</Table.Root>
					</Card.Content>
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
				<p class="text-red-500">{deleteExp.id}</p>
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
					db.expenses.delete(deleteExp.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
