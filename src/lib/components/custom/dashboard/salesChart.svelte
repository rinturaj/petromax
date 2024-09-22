<script lang="ts">
	import { Activity, Coins, PaintBucket, CreditCard } from 'lucide-svelte';

	import * as Card from '../../ui/card';
	import Chart from './Chart.svelte';
	import type { Observable } from 'dexie';
	import type { SaleModel } from '../../../../database/model';
	import { writable } from 'svelte/store';

	export let salesList: Observable<SaleModel[]>;
	let chartData = writable<any>(null);
	$: if (salesList) {
		console.log($salesList);
		let labels = [
			...new Set($salesList?.map((sale) => new Date(sale.salesDate).toLocaleDateString()))
		];

		let data = [...new Array(labels.length)].map(
			(_, index) =>
				$salesList
					.filter((sale) => new Date(sale.salesDate).toLocaleDateString() === labels[index]) // Filter by date
					.reduce((sum, sale) => sum + sale.totalCollection, 0) // Sum totalCollection
		);
		let discrepancy = [...new Array(labels.length)].map(
			(_, index) =>
				$salesList
					.filter((sale) => new Date(sale.salesDate).toLocaleDateString() === labels[index]) // Filter by date
					.reduce((sum, sale) => sum + sale.discrepancy, 0) // Sum totalCollection
		);
		console.log(labels, data);

		chartData.set({
			labels: labels,
			datasets: [
				{
					label: 'Sales',
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1,
					data: data
				},
				{
					label: 'Discrepancy',
					backgroundColor: '#f6403b80',
					borderColor: '#f6403b80',
					borderWidth: 1,
					data: discrepancy
				}
			]
		});
	}

	const chartOptions = {
		responsive: true,

		scales: {
			y: {
				beginAtZero: true
			}
		}
	};
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
	<Card.Root class="col-span-7">
		<Card.Header>
			<Card.Title>Sales Overview</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if !!chartData}
				<Chart data={$chartData} options={chartOptions} />
			{/if}
		</Card.Content>
	</Card.Root>
	<!-- <Card.Root class="col-span-3">
		<Card.Header>
			<Card.Title>Recent Sales</Card.Title>
			<Card.Description>You made 265 sales this month.</Card.Description>
		</Card.Header>
		<Card.Content>
			<RecentSales />
		</Card.Content>
	</Card.Root> -->
</div>
