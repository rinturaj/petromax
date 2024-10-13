<script lang="ts">
	import { liveQuery } from 'dexie';
	import { db } from '../../../../database/db';
	import Copy from 'lucide-svelte/icons/copy';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { DateFormatter } from '@internationalized/date';
	import { Download } from 'lucide-svelte';
	import { toFixed, toNumber } from '../../../../lib/utils';
	import NosilOverview from '../../../../lib/components/custom/dashboard/NosilOverview.svelte';
	import html2canvas from 'html2canvas';
	import { jsPDF } from 'jspdf';
	import { viewSummary } from '../../../../lib/component.store';
	let divToPrint: HTMLElement;

	async function printDiv() {
		const canvas = await html2canvas(divToPrint, {
			scale: 2 // Increase the scale for higher quality
		});

		// Convert canvas to an image
		const imgData = canvas.toDataURL('image/png');

		// Create a new PDF document
		const pdf = new jsPDF({
			orientation: 'p', // 'p' for portrait, 'l' for landscape
			unit: 'px', // Set the unit to pixels for better control
			format: [canvas.width, canvas.height] // Set the PDF size to match the canvas
		});

		// Add the captured image to the PDF
		pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

		// Save the PDF
		if ($summary?.createdOn) {
			pdf.save(
				`${$summary.createdOn.getFullYear()}/${$summary.createdOn.getMonth() + 1}/${$summary.createdOn.getDate()}-summary.pdf`
			);
		}
	}

	$: summary = liveQuery(async () => {
		return await db.salesSummary.get($viewSummary);
	});

	$: salesList = liveQuery(async () => {
		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(23, 59, 59, 999);
		return await db.sales.where('salesDate').between(startDate, endDate, true, true).toArray();
	});

	$: startDate = new Date($summary?.createdOn || new Date());
	$: endDate = new Date($summary?.createdOn || new Date());
	const df = new DateFormatter('en-US', {
		dateStyle: 'full'
	});
</script>

<div class="p-4" bind:this={divToPrint}>
	<Card.Root class="">
		<Card.Header class="flex flex-row items-start bg-muted/50">
			<div class="grid gap-0.5">
				<Card.Title class="group flex items-center gap-2 text-lg">
					Sales Summary
					<Button
						size="icon"
						variant="outline"
						class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<Copy class="h-3 w-3" />
						<span class="sr-only">Copy Order ID</span>
					</Button>
				</Card.Title>
				<Card.Description
					>Date: <span class="font-bold">
						{df.format($summary?.createdOn || new Date())}
					</span></Card.Description
				>
			</div>
			<div class="ml-auto flex items-center gap-1">
				<Button size="sm" variant="outline" on:click={printDiv} class="h-8 gap-1">
					<Download class="h-3.5 w-3.5" />
					<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Download </span>
				</Button>
			</div>
		</Card.Header>
		<Card.Content class="p-6 text-sm">
			<div class="grid gap-3">
				<div class="font-semibold">Sales Details</div>
				<ul class="grid gap-3">
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground"> Cash In Hand </span>
						<span class="currency">{toFixed($summary?.totalCollectionReceived)}</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground"> Sales In Hand </span>
						<span class="currency">{toFixed($summary?.totalSaleInHand)}</span>
					</li>
					<li
						class="flex items-center justify-between font-extrabold {$summary?.excessInHand ==
							undefined || $summary?.excessInHand >= 0
							? 'text-green-600'
							: 'text-red-600'} "
					>
						<span class="text-muted-foreground"> Excess </span>
						<span class="currency">{toFixed($summary?.excessInHand)}</span>
					</li>
				</ul>
				<Separator class="my-2" />

				<ul class="grid gap-3">
					<li class="flex items-center justify-between font-extrabold">
						<span class="text-muted-foreground">Credit Settled </span>
						<span class="currency text-green-700">{toFixed($summary?.creditReceived)}</span>
					</li>
				</ul>
				<Separator class="my-2" />

				<ul class="grid gap-3">
					<li class="flex items-center justify-between font-extrabold">
						<span class="text-muted-foreground">Oil Sales </span>
						<span class="currency text-green-700">{toFixed($summary?.oilSalesReceived)}</span>
					</li>
				</ul>
				<Separator class="my-2" />

				<ul class="grid gap-3">
					<li
						class="flex items-center justify-between font-extrabold {$summary?.balance ==
							undefined || $summary?.balance >= 0
							? 'text-green-600'
							: 'text-red-600'} "
					>
						<span class="text-muted-foreground"> Balance </span>
						<span class="currency">{toFixed($summary?.balance)}</span>
					</li>
				</ul>
				<Separator class="my-2" />
				<div class="font-semibold">Sales Breakdown</div>

				<ul class="grid gap-3">
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">Cash</span>
						<span class="currency">{toFixed($summary?.totalSaleInHand)}</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">UPI</span>
						<span class="currency">{toFixed($summary?.upi)}</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">Card</span>
						<span class="currency">{toFixed($summary?.card)}</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">HP Pay</span>
						<span class="currency">{toFixed($summary?.hpPay)}</span>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">Credit</span>
						<span class="currency">{toFixed($summary?.credit)}</span>
					</li>

					<li class="flex items-center justify-between font-extrabold">
						<span class="text-muted-foreground">Sale Revenue</span>
						<span class="currency">{toFixed($summary?.total)}</span>
					</li>
				</ul>
			</div>
			<Separator class="my-4" />
			<div class="font-semibold">Nosil Details</div>

			<div class="grid grid-cols-1 gap-4">
				<NosilOverview {salesList}></NosilOverview>
			</div>
			<Separator class="my-4" />
			<div class="grid gap-3">
				<div class="font-semibold">Cash Breakdown</div>
				<dl class="grid gap-3">
					{#if $summary?.records && $summary?.records.length > 0}
						{#each $summary?.records as s}
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">
									<span class="currency">{s.denomination}</span> x {s.quantity}
								</dt>
								<dd class="currency">{toNumber(s.quantity * s.denomination)}</dd>
							</div>
						{/each}
					{/if}
				</dl>
			</div>
			<Separator class="my-4" />
			<div class="grid gap-3">
				<dl class="grid gap-3">
					<div class="flex items-center justify-between">
						<dt class="flex items-center gap-1 text-muted-foreground">
							<CreditCard class="h-4 w-4" />
							Total
						</dt>
						<dd class="currency font-extrabold">{$summary?.totalCollectionReceived}</dd>
					</div>
				</dl>
			</div>
		</Card.Content>
		<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
			<div class="text-xs text-muted-foreground">
				Created On <time dateTime="2023-11-23">{df.format(new Date())}</time>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
