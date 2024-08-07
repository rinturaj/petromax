<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { componentSide } from '../../component.store';
	import Button from '../ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
</script>

<div class="w-full p-3">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>Add Expenses</Card.Title>
		<Card.Description>Create or update Expenses details</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<div class="grid gap-3">
				<Label for="name">Date</Label>
				<Input id="name" type="date" class="block w-full" placeholder="name here" value="" />
			</div>
			<div class="grid gap-3">
				<Label for="name">title</Label>
				<Input id="name" type="text" class="w-full" placeholder="name here" value="" />
			</div>
			<div class="grid gap-3">
				<Label for="name">Details</Label>
				<Textarea id="name" class="w-full" placeholder="name here" value="" />
			</div>
			<div class="grid gap-3">
				<Label for="name">Type</Label>
				<Select.Root>
					<Select.Trigger>
						<Select.Value placeholder="Choose Type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Type</Select.Label>
							{#each ['Credit', 'Settled Up'] as type}
								<Select.Item value={type} label={type}>{type}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="type" />
				</Select.Root>
			</div>
			<div class="grid gap-3">
				<Label for="name">Amount</Label>
				<Input id="name" type="number" class="w-full" placeholder="name here" value="" />
			</div>
		</div></Card.Content
	>
	<Card.Footer class="justify-end">
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
