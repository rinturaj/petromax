<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import { Description } from '../ui/dialog';
	import Badge from '../ui/badge/badge.svelte';
	import type { SaleModel } from '../../../database/model';
	import { DateFormatter } from '@internationalized/date';
	import { format } from 'date-fns';

	export let data: SaleModel;

	$: if (!!data) {
		console.log(data);
	}

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
</script>

<div class="w-full">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>{data.employeeName}| ID: {data.employeeId}</Card.Title>
		<Card.Description>
			Shift Time :
			<Badge class="mx-1 text-xs" variant="default">{data.checkIn}</Badge>-
			<Badge class="text-xs" variant="default">{data.checkOut}</Badge>
			<span class="mx-3">| Time:</span> <span class="px-2">{data.totalHours}h</span>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-3 gap-3 rounded-lg border bg-slate-100 p-2">
			<div class="grid gap-3">
				<Label for="name">Date</Label>
				<h6 class="font-bold text-slate-900">{df.format(data.salesDate)}</h6>
			</div>
			<div class="grid gap-3">
				<Label for="name">Petrol Price</Label>
				<h6 class="currency font-bold text-blue-600">{data.petrolPrice}</h6>
			</div>
			<div class="grid gap-3">
				<Label for="name">Diesel Price</Label>
				<h6 class="currency font-bold text-yellow-600">{data.dieselPrice}</h6>
			</div>
		</div>

		<ScrollArea class="w-100 mt-6 h-56">
			<h6 class="sticky font-extrabold">Reading</h6>

			{#each data.readings as item}
				<div class="my-2 grid grid-cols-7 gap-2 rounded-lg border p-2">
					<div>
						<h6 class=" text-xs text-muted-foreground">Nossil</h6>
						<h6 class="text-sm font-semibold text-black">{item.nosil}</h6>
					</div>

					<div>
						<h6 class=" text-xs text-muted-foreground">Opening</h6>
						<h6 class="text-sm font-semibold text-black">{item.openingReadings}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Closing</h6>
						<h6 class="text-sm font-semibold text-black">{item.closingReadings}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Liter</h6>
						<h6 class="text-sm font-semibold text-orange-400">{item.totalLitre}</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Test Liter</h6>
						<h6 class="text-sm font-semibold text-orange-400">{item.testLiter}</h6>
					</div>
					<div class="text-right">
						<h6 class=" text-xs text-muted-foreground">Total Liters</h6>
						<h6 class="text-sm font-semibold text-green-600">{item.grossTotalLitre}</h6>
					</div>
					<div class="text-right">
						<h6 class=" text-xs text-muted-foreground">Amount</h6>
						<h6 class="currency text-sm font-semibold text-green-800">{item.totalPrice}</h6>
					</div>
				</div>
			{/each}
		</ScrollArea>
		<h6 class="sticky pb-3 font-extrabold">Collection</h6>

		<div class="grid grid-cols-5 gap-2 rounded-lg border bg-blue-50 p-3">
			<div class="grid gap-1">
				<Label for="name">By Cash</Label>
				<h6 class=" font-semibold text-blue-800">{data.byCash}</h6>
			</div>
			<div class="grid gap-1">
				<Label for="name">UPI</Label>
				<h6 class=" font-semibold text-blue-800">{data.upiPayment}</h6>
			</div>
			<div class="grid gap-1">
				<Label for="name">Card</Label>
				<h6 class=" font-semibold text-blue-800">{data.card}</h6>
			</div>
			<div class="grid gap-1">
				<Label for="name">HP Pay</Label>
				<h6 class=" font-semibold text-blue-800">{data.hpPay}</h6>
			</div>
			<div class="grid gap-1">
				<Label for="name">Credit</Label>
				<h6 class=" font-semibold text-rose-600">{data.credit}</h6>
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<div class="grid grid-cols-5 gap-2">
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">System Calculated Amount</h6>
				<h6 class="currency text-sm font-semibold">{data.actuals}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Total Collection</h6>
				<h6 class="currency text-sm font-semibold">{data.totalCollection}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">In Hand</h6>
				<h6 class="currency text-sm font-semibold">{data.inHand}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Credit</h6>
				<h6 class="currency text-sm font-semibold">{data.credit}</h6>
			</div>
			<div class="grid">
				<h6 class=" text-xs text-muted-foreground">Difference</h6>
				<h6
					class="currency text-sm font-extrabold {data.discrepancy >= 0
						? 'text-green-600'
						: 'text-red-600'}"
				>
					{data.discrepancy}
				</h6>
			</div>
		</div>
		<div class="grid">
			<h6 class=" text-xs text-muted-foreground">Difference</h6>
			<h6 class="text-sm font-extrabold text-green-600">$11222</h6>
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
