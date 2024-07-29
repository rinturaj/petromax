<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import Calendar from '../ui/calendar/calendar.svelte';
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Add Stock</Card.Title>
		<Card.Description>Create or update stock details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<!-- <div class="grid gap-3">
				<Calendar class="rounded-md border shadow" />
			</div> -->

			<div class="grid gap-3">
				<Label for="name">Opening Stock</Label>
				<Input id="name" type="Numbet" class="w-full" placeholder="price " value="" />
			</div>
			<div class="grid gap-3">
				<Label for="name">Dip Stock</Label>
				<Input id="name" type="Numbet" class="w-full" placeholder="price " value="" />
			</div>
			<div class="grid gap-3">
				<Label for="name">Closing Stock</Label>
				<Input id="name" type="Numbet" class="w-full" placeholder="price " value="" />
			</div>
		</div>
	</Card.Content>
	<Card.Footer>
		<Button
			on:click={() => {
				componentSide.set(null);
			}}
			variant="outline"
			class="mr-3">Cancel</Button
		>
		<Button>Add</Button>
	</Card.Footer>
	<!-- </Card.Root> -->
</div>
