<script>
	import * as Card from '$lib/components/ui/card';
	import { Activity, CreditCard, DollarSign, Trash2, Users } from 'lucide-svelte';
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium text-muted-foreground">Nossil</Card.Title>
			<Trash2 class="h-4 w-4 text-red-600" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">MS</div>
			<p class="text-xs text-muted-foreground">Created On 11222022</p>
		</Card.Content>
	</Card.Root>
</div>
