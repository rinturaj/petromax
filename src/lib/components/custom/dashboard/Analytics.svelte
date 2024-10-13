<script lang="ts">
	import NosilOverview from './NosilOverview.svelte';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { Observable } from 'dexie';
	import type { CreditModel, SaleModel } from '../../../../database/model';
	import { toNumber } from '../../../utils';
	import { subMilliseconds } from 'date-fns';
	import { writable } from 'svelte/store';
	import Chart from './Chart.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	export let salesList: Observable<SaleModel[]>;
	export let creditList: Observable<CreditModel[]>;

	let tableData: any = {};
	let totalCollection: number;
	let sales: any = {};
	let chartData = writable<any>(null);

	$: totalSettled = $creditList
		? $creditList
				.filter((x) => x?.type !== 'Credit')
				.map((x: CreditModel) => x.amount || 0)
				.reduce((sum: number, x: number) => toNumber((-x - sum) * -1), 0)
		: 0;
	$: if ($salesList) {
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

		chartData.set({
			labels: ['Revenue', 'Cash', 'UPI', 'Card', 'Credt', 'HP PAY', 'Discrepancy'],
			datasets: [
				{
					label: 'Sales',
					borderWidth: 1,
					data: [
						sales.actuals,
						sales.byCash,
						sales.upiPayment,
						sales.card,
						sales.credit,
						sales.hpPay,
						sales.discrepancy
					]
				}
			]
		});

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

<button>Print</button>

<div class="grid grid-cols-2 items-center gap-2 align-middle">
	<div>
		<div class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Revenue:</span>
				<span class="currency text-lg font-bold text-yellow-700">{sales.actuals}</span>
			</div>

			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Total Collection:</span>
				<span class="currency text-lg font-bold text-green-700">{sales.totalCollection}</span>
			</div>

			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Discrepancy:</span>
				<span class="currency text-lg font-bold text-red-700">{sales.discrepancy}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">InHand: (without credit Amount)</span>
				<span class="currency text-lg font-bold text-blue-700">{sales.inHand}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-lg font-semibold">Settled Amount:</span>
				<span class="currency text-lg font-bold text-blue-700">{totalSettled}</span>
			</div>
			<Accordion.Root class="w-full ">
				<Accordion.Item value="item-1">
					<Accordion.Trigger
						><span class="text-lg font-semibold">Breakdown</span>
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold">Cash:</span>
							<span class="currency text-lg font-bold text-blue-700">{sales.byCash}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold">Card:</span>
							<span class="currency text-lg font-bold text-blue-700">{sales.card}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold">UPI:</span>
							<span class="currency text-lg font-bold text-blue-700">{sales.upiPayment}</span>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold">Credit:</span>
							<span class="currency text-lg font-bold text-red-700">{sales.credit}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold">HP Pay:</span>
							<span class="currency text-lg font-bold text-green-700">{sales.hpPay}</span>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
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
		<!-- <Card.Description>Recent sales from your store.</Card.Description> -->
	</Card.Header>
	<Card.Content>
		<NosilOverview {salesList}></NosilOverview>
	</Card.Content>
</Card.Root>
