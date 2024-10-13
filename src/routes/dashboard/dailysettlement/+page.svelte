<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import DatePickerWithRange from '../../../lib/components/custom/date-picker-with-range.svelte';
	import type { Expenses, SalesSummary } from '../../../database/model';
	import { componentData, componentSide } from '../../../lib/component.store';
	import type { DateRange } from 'bits-ui';
	import * as Table from '$lib/components/ui/table/index.js';
	import { db } from '../../../database/db';
	import DailySettlement from '../../../lib/components/custom/DailySettlement.svelte';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { liveQuery } from 'dexie';
	import { Trash2, Edit } from 'lucide-svelte';
	import { base } from '$app/paths';

	const add = () => {
		componentSide.set(DailySettlement);
	};
	const addComponent = (ex: SalesSummary) => {
		componentSide.set(DailySettlement);
		componentData.set(ex);
	};

	let onDelete = false;
	let deleteExp: SalesSummary;
	let dateValue: DateRange;

	$: summary = liveQuery(async () => {
		return await db.salesSummary.where('createdOn').between(startDate, endDate).toArray();
	});

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

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
					<Card.Title>Your Sales Summary</Card.Title>
				</Card.Header>
				<Card.Footer>
					<Button on:click={add}>Create New Sales Summary</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Today's</Card.Description>
					<!-- <Card.Title class="currency text-4xl">{toNumber(totalDay || 0)}</Card.Title> -->
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
					<!-- <Card.Title class="currency text-3xl">{toNumber(totalMonth || 0)}</Card.Title> -->
				</Card.Header>
				<!-- <Card.Content>
					<div class="text-xs text-muted-foreground">+10% from last month</div>
				</Card.Content>
				<Card.Footer>
					<Progress value={12} aria-label="12% increase" />
				</Card.Footer> -->
			</Card.Root>
		</div>

		<Card.Root>
			<Card.Header class="flex flex-row justify-between px-7 ">
				<div>
					<!-- <Card.Title
						>Expenses Details for {df.format(
							dateValue?.start?.toDate(getLocalTimeZone()) ?? new Date()
						)} - {df.format(dateValue?.end?.toDate(getLocalTimeZone()) ?? new Date())}</Card.Title
					> -->
					<Card.Description>
						Selected Date Range Sales are shown. Choose earlier date for previous month's details.
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
							<Table.Head class="hidden sm:table-cell">Date</Table.Head>
							<Table.Head class="hidden sm:table-cell">Total Sales InHand</Table.Head>
							<Table.Head>Collection Received</Table.Head>

							<Table.Head class="">Credit Received</Table.Head>
							<Table.Head class="">Balance</Table.Head>
							<Table.Head class="text-right"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if !!$summary && $summary.length > 0}
							{#each $summary as exp}
								<Table.Row class="bg-accent">
									<Table.Cell class="hidden sm:table-cell">{df.format(exp.createdOn)}</Table.Cell>
									<Table.Cell>
										<div class="currency font-bold">{exp.totalSaleInHand}</div>
									</Table.Cell>
									<Table.Cell class="currency font-bold">{exp.totalCollectionReceived}</Table.Cell>
									<Table.Cell class="currency font-bold">{exp.creditReceived}</Table.Cell>
									<Table.Cell class="currency font-bold">{exp.balance}</Table.Cell>
									<Table.Cell>
										<div class="flex items-center justify-end space-x-2">
											<Button variant="link" href={`/dashboard/dailysettlement/${exp.id}`}>
												View Report
											</Button>
											<Button on:click={() => addComponent(exp)} size="icon" variant="ghost">
												<Edit size={16}></Edit>
											</Button>
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
								<Table.Cell colspan={6} class="mt-4 pt-4 text-center font-medium">
									<div class="flex flex-col items-center">
										<div class="text-2xl font-bold text-gray-700">
											No Sales Summary Data Available
										</div>
										<p class="mt-2 text-gray-500">
											Please add some Sales Summary data to get started.
										</p>
										<Button class="mt-3" on:click={() => add()}>Add New Sales Summary</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
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
					db.salesSummary.delete(deleteExp.id);
					onDelete = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
