<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import {
		SalesSummaryClass,
		type CreditModel,
		type SalesRecord,
		type SalesSummary
	} from '../../../database/model';
	import { format } from 'date-fns';
	import { db } from '../../../database/db';
	import { toast } from 'svelte-sonner';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import { toNumber } from '../../utils';
	import { liveQuery } from 'dexie';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Coins, Trash2 } from 'lucide-svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	let sales: any = {};
	export let data: SalesSummary = new SalesSummaryClass();

	$: creditList = liveQuery(async () => {
		return await db.credit.where('createdOn').between(startDate, endDate, true, true).toArray();
	});

	$: totalSettled = $creditList
		? $creditList
				.filter((x) => x?.type !== 'Credit')
				.map((x: CreditModel) => x.amount || 0)
				.reduce((sum: number, x: number) => toNumber((-x - sum) * -1), 0)
		: 0;

	$: salesList = liveQuery(async () => {
		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(23, 59, 59, 999);
		return await db.sales.where('salesDate').between(startDate, endDate, true, true).toArray();
	});

	$: cashRecords = data.records.reduce(
		(sum: number, x: SalesRecord) => sum + toNumber(x.denomination * x.quantity),
		0
	);

	$: if (!!$salesList) {
		sales = $salesList.reduce(
			(acc: any, val: any) => {
				return {
					actuals: toNumber(toNumber(acc.actuals) + toNumber(val.actuals)),
					byCash: toNumber(toNumber(acc.byCash) + toNumber(val.byCash)),
					upiPayment: toNumber(toNumber(acc.upiPayment) + toNumber(val.upiPayment)),
					card: toNumber(toNumber(acc.card) + toNumber(val.card)),
					hpPay: toNumber(toNumber(acc.hpPay) + toNumber(val.hpPay)),
					credit: toNumber(toNumber(acc.credit) + toNumber(val.credit)),

					totalCollection: toNumber(toNumber(acc.totalCollection) + toNumber(val.totalCollection)),

					inHand: toNumber(toNumber(acc.inHand) + toNumber(val.inHand)),

					discrepancy: toNumber(toNumber(acc.discrepancy) + toNumber(val.discrepancy))
				};
			},
			{
				byCash: 0,
				upiPayment: 0,
				card: 0,
				hpPay: 0,
				credit: 0,
				totalCollection: 0,
				inHand: 0,
				actuals: 0,
				discrepancy: 0
			}
		);
	}

	$: formattedStockDate = format(data.createdOn, 'yyyy-MM-dd');

	$: startDate = new Date(data.createdOn);
	$: endDate = new Date(data.createdOn);

	function handleDateChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const selectedDate = new Date(input.value);
		if (!isNaN(selectedDate.getTime())) {
			data.createdOn = selectedDate;
		}
	}

	let add = () => {
		data.creditReceived = totalSettled;
		data.totalSaleInHand = sales.byCash;
		data.totalCollectionReceived = cashRecords;
		data.card = sales.card;
		data.credit = sales.credit;
		data.hpPay = sales.hpPay;
		data.upi = sales.upiPayment;
		data.total = sales.revenue;

		data.excessInHand = toNumber(cashRecords - sales.byCash);
		data.balance = toNumber(data.excessInHand - totalSettled);
		db.salesSummary.add(data);
		componentSide.set(null);
		toast.success('Daily Summary added successfully');
	};
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Daily Summary</Card.Title>
		<Card.Description>Please select the date</Card.Description>
		<div class="grid grid-cols-2 gap-1">
			<div class="grid-col-2 grid gap-2">
				<Input
					id="stockDate"
					value={formattedStockDate}
					on:input={handleDateChange}
					type="date"
					class="block"
					placeholder="Select date"
				/>
			</div>
			<div></div>
		</div>
	</Card.Header>
	<Card.Content>
		<ScrollArea class="h-96 p-4">
			<div class="grid grid-cols-1 gap-6">
				<div class="grid grid-cols-2 gap-5">
					<div class="flex items-center justify-between border-b">
						<span class="text-sm font-semibold">Revenue:</span>
						<span class="currency text-lg font-bold text-yellow-700">{sales.actuals}</span>
					</div>
					<div class="flex items-center justify-between border-b">
						<span class="text-sm font-semibold">Cash:</span>
						<span class="currency text-lg font-bold text-blue-700">{sales.byCash}</span>
					</div>
					<div class="flex items-center justify-between border-b">
						<span class="text-sm font-semibold">Card:</span>
						<span class="currency text-lg font-bold text-blue-700">{sales.card}</span>
					</div>
					<div class="flex items-center justify-between border-b">
						<span class="text-sm font-semibold">UPI:</span>
						<span class="currency text-lg font-bold text-blue-700">{sales.upiPayment}</span>
					</div>

					<div class="flex items-center justify-between border-b">
						<span class="text-sm font-semibold">Credit:</span>
						<span class="currency text-lg font-bold text-red-700">{sales.credit}</span>
					</div>
					<div class="flex items-center justify-between border-b">
						<span class="text-sm font-semibold">HP Pay:</span>
						<span class="currency text-lg font-bold text-green-700">{sales.hpPay}</span>
					</div>

					<div class="flex items-center justify-between border-b">
						<span class="text-sm font-semibold">Settled Amount:</span>
						<span class="currency text-lg font-bold text-blue-700">{totalSettled}</span>
					</div>
				</div>
				<div class="grid gap-3">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="hidden sm:table-cell">Denomination</Table.Head>
								<Table.Head class="hidden sm:table-cell">Quantity</Table.Head>
								<Table.Head class="text-right">Amount</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#if !!data.records && data.records.length > 0}
								{#each data.records as exp}
									<Table.Row class="bg-accent ">
										<Table.Cell class="m-2 p-2">
											<div class="font-medium">{exp.denomination}</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell"
											><Input
												id="name"
												class="block"
												type="number"
												placeholder="Quantity "
												bind:value={exp.quantity}
											/></Table.Cell
										>
										<Table.Cell class="currency font-bold"
											>{toNumber(exp.quantity * exp.denomination)}</Table.Cell
										>
									</Table.Row>
								{/each}
							{/if}
						</Table.Body>
					</Table.Root>
				</div>
			</div>
		</ScrollArea>
	</Card.Content>
	<Card.Footer class="justify-end">
		<div class="grid w-full grid-cols-5 gap-2">
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Total Sale in Hand</h6>
				<h6 class="currency text-sm font-semibold">{sales.byCash}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Total Cash In Hand</h6>
				<h6
					class="currency text-sm font-extrabold {cashRecords > 0
						? 'text-green-600'
						: 'text-red-600'}"
				>
					{cashRecords}
				</h6>
			</div>

			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Excess In Hand</h6>
				<h6
					class="text-sm font-extrabold {toNumber(cashRecords - sales.byCash) > 0
						? 'text-green-600'
						: 'text-red-600'}"
				>
					{toNumber(cashRecords - sales.byCash)}
				</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Credit Settled</h6>
				<h6 class="currency text-sm font-semibold">{totalSettled}</h6>
			</div>

			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Balance</h6>
				<h6
					class="currency text-sm font-extrabold {toNumber(
						cashRecords - sales.byCash - totalSettled
					) > 0
						? 'text-green-600'
						: 'text-red-600'}"
				>
					{toNumber(cashRecords - sales.byCash - totalSettled)}
				</h6>
			</div>
		</div>

		<Button
			on:click={() => {
				componentSide.set(null);
			}}
			variant="outline"
			class="mr-3">Cancel</Button
		>
		<Button on:click={add}>Sumbit</Button>
	</Card.Footer>
	<!-- </Card.Root> -->
</div>
