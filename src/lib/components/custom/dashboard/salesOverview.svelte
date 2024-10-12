<script>
	import { Activity, Coins, PaintBucket, CreditCard } from 'lucide-svelte';

	import * as Card from '../../ui/card';
	import { toNumber } from '../../../utils';

	export let revenueMonth;
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
			<Coins class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="currency text-2xl font-bold text-blue-950">{toNumber(revenueMonth?.revenue)}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm  font-medium">Collection</Card.Title>
			<PaintBucket class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="currency text-2xl font-bold text-blue-700">
				{toNumber(revenueMonth?.collected)}
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Credit</Card.Title>
			<CreditCard class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="currency text-2xl font-bold">{toNumber(revenueMonth?.credit)}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Discrepancy</Card.Title>
			<Activity class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div
				class="currency text-2xl font-bold {toNumber(revenueMonth.discrepancy) >= 0
					? 'text-green-600'
					: 'text-red-600'}"
			>
				{toNumber(revenueMonth.discrepancy)}
			</div>
		</Card.Content>
	</Card.Root>
</div>
