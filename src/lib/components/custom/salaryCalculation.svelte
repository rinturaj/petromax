<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import type { SaleModel, Staff } from '../../../database/model';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import DatePickerWithRange from './date-picker-with-range.svelte';
	import type { DateRange } from 'bits-ui';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import Input from '../ui/input/input.svelte';
	import { toNumber } from '../../utils';

	export let data: Staff;

	$: salesList = liveQuery(async () => {
		return await db.sales
			.where('salesDate')
			.between(startDate, endDate, true, true)
			.and((x) => x.employeeName == data.name)
			.reverse()
			.sortBy(sortBy);
	});

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let dateValue: DateRange;
	let sortBy: string = 'salesDate';
	let filterBy: string = '';

	let sortDesc: boolean;

	let calculationResults = {
		totalDiscrepancy: 0,
		totalHours: 0,
		finalAmount: 0,
		salary: 0,
		hourlyCharge: 0
	};

	$: if ($salesList != null && $salesList.length > 0) {
		calculationResults = $salesList.reduce(
			(sum: any, x: SaleModel) => {
				return {
					totalDiscrepancy: toNumber(Number(sum.totalDiscrepancy) + Number(x.discrepancy)),
					totalHours: toNumber(Number(sum.totalHours) + Number(x.totalHours)),
					finalAmount: 0,
					salary: 0,
					hourlyCharge: data.hourlyPrice
				};
			},
			{
				totalDiscrepancy: 0,
				totalHours: 0,
				finalAmount: 0,
				salary: 0,
				hourlyCharge: 0
			}
		);
		calculationResults.salary = toNumber(calculationResults.totalHours * data.hourlyPrice);
	}

	$: startDate =
		dateValue != null && dateValue.start != null
			? dateValue.start?.toDate(getLocalTimeZone())
			: new Date();
	$: endDate =
		dateValue != null && dateValue.end != null
			? dateValue.end?.toDate(getLocalTimeZone())
			: new Date();
</script>

<div class="w-full">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Salary Calculation</Card.Title>
		<Card.Description></Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-2 gap-2 rounded-lg border bg-slate-100 p-2">
			<div class="grid">
				<Label for="name">Employee Name</Label>
				<h6 class="font-bold text-slate-900">{data.name}</h6>
			</div>
			<div class="grid justify-end">
				<DatePickerWithRange bind:value={dateValue} />
			</div>
		</div>

		<ScrollArea class="w-100 mt-6 h-56">
			<h6 class="sticky font-extrabold">Sales</h6>
			{#if !!$salesList && $salesList.length > 0}
				{#each $salesList as rd}
					<div class="my-2 grid grid-cols-6 gap-2 rounded-lg border p-2">
						<div>
							<h6 class=" text-xs text-muted-foreground">Date</h6>
							<h6 class="text-sm font-semibold text-black">{df.format(rd.salesDate)}</h6>
						</div>
						<div>
							<h6 class=" text-xs text-muted-foreground">Hours</h6>
							<h6 class="text-sm font-semibold text-black">{rd.totalHours}</h6>
						</div>
						<div>
							<h6 class=" text-xs text-muted-foreground">Collection</h6>
							<h6 class="currency text-sm font-semibold text-black">{rd.totalCollection}</h6>
						</div>
						<div>
							<h6 class=" text-xs text-muted-foreground">Credit</h6>
							<h6 class="currency text-sm font-semibold text-black">{rd.credit}</h6>
						</div>
						<div>
							<h6 class=" text-xs text-muted-foreground">Actuals</h6>
							<h6 class="currency text-sm font-semibold text-black">{rd.actuals}</h6>
						</div>
						<div>
							<h6 class=" text-xs text-muted-foreground">Discrepancy</h6>
							<h6 class="currency text-sm font-semibold text-black">{rd.discrepancy}</h6>
						</div>
					</div>
				{/each}
			{/if}
		</ScrollArea>
	</Card.Content>
	<Card.Footer class="grid">
		<div class="grid grid-cols-4 gap-2">
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Hourly Charge</h6>
				<Input class="" bind:value={data.hourlyPrice}></Input>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Total Hours</h6>
				<h6 class="currency text-sm font-semibold">{calculationResults.totalHours}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Sales Discrepancy</h6>
				<h6 class="currency text-sm font-semibold">{calculationResults.totalDiscrepancy}</h6>
			</div>
			<!-- <div class="grid">
				<h6 class=" text-xs text-muted-foreground">Credit</h6>
				<h6 class="currency text-sm font-semibold">{data.credit}</h6>
			</div> -->
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Final Amount</h6>
				<h6 class=" text-sm font-extrabold">
					<span class="currency">{calculationResults.salary} + </span>
					<span class="currency">
						{calculationResults.totalDiscrepancy}
						=</span
					>
					<span
						class="currency {toNumber(
							calculationResults.salary + calculationResults.totalDiscrepancy
						) >= 0
							? 'text-green-600'
							: 'text-red-600'}"
					>
						{toNumber(calculationResults.salary + calculationResults.totalDiscrepancy)}
					</span>
				</h6>
			</div>
		</div>

		<!-- <div>
			<Button
				on:click={() => {
					componentSide.set(null);
				}}
				variant="outline"
				class="mr-3">Cancel</Button
			>
			<Button>Submit</Button>
		</div> -->
	</Card.Footer>
	<!-- </xCard.Root> -->
</div>
