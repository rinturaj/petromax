<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { Observable } from 'dexie';
	import type { SaleModel } from '../../../../database/model';
	import { toNumber } from '../../../utils';
	import { subMilliseconds } from 'date-fns';
	import { writable } from 'svelte/store';
	import Chart from './Chart.svelte';
	export let salesList: Observable<SaleModel[]>;

	let tableData: any = {};
	let totalCollection: number;
	let sales: any = {};
	let chartData = writable<any>(null);

	$: if ($salesList) {
		sales = $salesList.reduce(
			(acc: any, val: any) => {
				return {
					byCash: toNumber(acc.byCash) + toNumber(val.byCash),
					upiPayment: toNumber(acc.upiPayment) + toNumber(val.upiPayment),
					card: toNumber(acc.card) + toNumber(val.card),
					hpPay: toNumber(acc.hpPay) + toNumber(val.hpPay),
					credit: toNumber(acc.credit) + toNumber(val.credit),
					totalCollection: toNumber(acc.totalCollection) + toNumber(val.totalCollection),
					inHand: toNumber(acc.inHand) + toNumber(val.inHand),
					actuals: toNumber(acc.actuals) + toNumber(val.actuals),
					discrepancy: toNumber(acc.discrepancy) + toNumber(val.discrepancy)
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

		chartData.set({
			labels: ['Revenue', 'Collection', 'Credt', 'HP PAY', 'Discrepancy'],
			datasets: [
				{
					label: 'Sales',
					borderWidth: 1,
					data: [sales.actuals, sales.totalCollection, sales.credit, sales.hpPay, sales.discrepancy]
				}
			]
		});

		tableData = $salesList
			.map((x) => x.readings)
			.flatMap((x) =>
				x.map((y) => {
					return y;
				})
			)
			.reduce((acc: any, current) => {
				const { nosil } = current;
				if (!acc[nosil]) {
					acc[nosil] = { ...current }; // Directly assign current if not present
					return acc;
				}
				const existing = acc[nosil];
				acc[nosil] = {
					...existing,
					closingReadings: Math.max(
						toNumber(existing.closingReadings || 0),
						current.closingReadings
					),
					grossTotalLitre:
						toNumber(existing.grossTotalLitre || 0) + toNumber(current.grossTotalLitre || 0),
					openingReadings: Math.min(
						toNumber(existing.openingReadings || 0),
						current.openingReadings
					),
					testLiter: toNumber(existing.testLiter || 0) + toNumber(current.testLiter || 0),
					totalLitre: toNumber(existing.totalLitre || 0) + current.totalLitre,
					totalPrice: toNumber(existing.totalPrice || 0) + toNumber(current.totalPrice || 0),
					unitPrice: '102' // Assuming unitPrice remains constant
				};
				return acc;
			}, {});
		tableData = Object.keys(tableData).map((x) => tableData[x]);
		totalCollection = tableData.reduce((acc: number, c: any) => {
			return Number(acc) + toNumber(c.totalPrice);
		}, 0);
		console.log(tableData);
	}

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top'
			},
			title: {
				display: true,
				text: 'Cash flow'
			}
		}
	};
</script>

<div class="grid grid-cols-2 items-center gap-2 align-middle">
	<div>
		<div class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Total Collection:</span>
				<span class="currency text-lg font-bold text-green-700">{sales.totalCollection}</span>
			</div>
			<!-- <div class="flex items-center justify-between">
				<span class="text-lg font-semibold">In Hand:</span>
				<span class="currency text-lg font-bold text-blue-700">{sales.inHand}</span>
			</div> -->
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Revenue:</span>
				<span class="currency text-lg font-bold text-yellow-700">{sales.actuals}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Credit:</span>
				<span class="currency text-lg font-bold text-blue-700">{sales.credit}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">HP Pay:</span>
				<span class="currency text-lg font-bold text-green-700">{sales.hpPay}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Discrepancy:</span>
				<span class="currency text-lg font-bold text-red-700">{sales.discrepancy}</span>
			</div>
		</div>
	</div>
	<div class="h-96">
		{#if !!chartData}
			<Chart data={$chartData} type="pie" options={chartOptions} />
		{/if}
	</div>
</div>
<Card.Root>
	<Card.Header class="px-7">
		<Card.Title>Nossil</Card.Title>
		<Card.Description>Recent orders from your store.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Nossil</Table.Head>
					<Table.Head class="hidden sm:table-cell">Opening</Table.Head>
					<Table.Head class="hidden sm:table-cell">Closing</Table.Head>
					<Table.Head class="hidden md:table-cell">Liter</Table.Head>
					<Table.Head class="">Test Liter</Table.Head>
					<Table.Head class="">Gross Total Liter</Table.Head>
					<Table.Head class="">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if !!tableData && tableData.length > 0}
					{#each tableData as tb}
						<Table.Row class="bg-accent">
							<Table.Cell>
								<div class="font-medium">{tb.nosil}</div>
							</Table.Cell>
							<Table.Cell class="hidden sm:table-cell">{tb.openingReadings}</Table.Cell>
							<Table.Cell class="hidden sm:table-cell">
								{tb.closingReadings}
							</Table.Cell>
							<Table.Cell class="hidden md:table-cell">{tb.totalLitre}</Table.Cell>
							<Table.Cell class="">{tb.testLiter}</Table.Cell>
							<Table.Cell class="">{tb.grossTotalLitre}</Table.Cell>
							<Table.Cell class="currency text-right text-green-700">{tb.totalPrice}</Table.Cell>
						</Table.Row>
					{/each}
					<Table.Row class=" text-lg font-bold">
						<Table.Cell colspan={6} class=" text-right text-primary">Total Amount</Table.Cell>
						<Table.Cell colspan={1} class="currency text-right text-green-700"
							>{totalCollection}</Table.Cell
						>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
