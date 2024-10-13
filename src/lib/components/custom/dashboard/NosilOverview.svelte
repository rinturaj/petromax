<script lang="ts">
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

	let tableData: any = {};
	let totalCollection: number;
	let totalLitre: number;
	let testLitre: number;
	let grossTotalLitre: number;
	$: if ($salesList) {
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
		totalLitre = tableData.reduce((acc: number, c: any) => {
			return Number(acc) + toNumber(c.totalLitre);
		}, 0);
		testLitre = tableData.reduce((acc: number, c: any) => {
			return Number(acc) + toNumber(c.testLiter);
		}, 0);
		grossTotalLitre = tableData.reduce((acc: number, c: any) => {
			return Number(acc) + toNumber(c.grossTotalLitre);
		}, 0);
	}
</script>

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
					<Table.Cell class="hidden sm:table-cell">{toNumber(tb.openingReadings)}</Table.Cell>
					<Table.Cell class="hidden sm:table-cell">
						{toNumber(tb.closingReadings)}
					</Table.Cell>
					<Table.Cell class="hidden md:table-cell">{toNumber(tb.totalLitre)}</Table.Cell>
					<Table.Cell class="">{toNumber(tb.testLiter)}</Table.Cell>
					<Table.Cell class="">{toNumber(tb.grossTotalLitre)}</Table.Cell>
					<Table.Cell class="currency text-right text-green-700"
						>{toNumber(tb.totalPrice)}</Table.Cell
					>
				</Table.Row>
			{/each}
			<Table.Row class=" text-sm font-bold">
				<Table.Cell colspan={3}></Table.Cell>

				<Table.Cell class="hidden md:table-cell">{toNumber(totalLitre)}</Table.Cell>
				<Table.Cell class="">{toNumber(testLitre)}</Table.Cell>
				<Table.Cell class="">{toNumber(grossTotalLitre)}</Table.Cell>
				<Table.Cell class="currency text-right text-green-700"
					>{toNumber(totalCollection)}</Table.Cell
				>
			</Table.Row>
			<Table.Row class=" text-lg font-bold">
				<Table.Cell colspan={6} class=" text-right text-primary">Total Amount</Table.Cell>
				<Table.Cell colspan={1} class="currency text-right text-green-700"
					>{toNumber(totalCollection)}</Table.Cell
				>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
