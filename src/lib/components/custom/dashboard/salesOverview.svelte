<script>
	import { Activity, Coins, PaintBucket, CreditCard } from 'lucide-svelte';

	import * as Card from '../../ui/card';

	export let revenueMonth;
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
			<Coins class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="currency text-2xl font-bold text-blue-950">{revenueMonth?.revenue}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm  font-medium">Collection</Card.Title>
			<PaintBucket class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="currency text-2xl font-bold text-blue-700">{revenueMonth?.collected}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Credit</Card.Title>
			<CreditCard class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="currency text-2xl font-bold">{revenueMonth?.credit}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Discrepancy</Card.Title>
			<Activity class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div
				class="currency text-2xl font-bold {revenueMonth.discrepancy >= 0
					? 'text-green-600'
					: 'text-red-600'}"
			>
				{revenueMonth.discrepancy}
			</div>
		</Card.Content>
	</Card.Root>
</div>
