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

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];
</script>

<div class="w-full">
	<!-- <Card.Root> -->
	<Card.Header>
		<Card.Title>New Sale</Card.Title>
		<Card.Description>Create new sale</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-3 gap-3 rounded-lg border bg-slate-100 p-5">
			<div class="grid gap-3">
				<Label for="name">Date</Label>
				<Input id="name" type="date" class="block" placeholder="price " value="" />
			</div>
			<div class="grid gap-3">
				<Label for="name">Petrol Price</Label>
				<Input id="name" type="number" class="block" placeholder="price " value="" />
			</div>
			<div class="grid gap-3">
				<Label for="name">Diesel Price</Label>
				<Input id="name" type="number" class="block" placeholder="price " value="" />
			</div>
		</div>

		<div class="grid grid-cols-2 grid-rows-1 gap-4 pt-5">
			<div class=" border-r pr-4">
				<div class="grid gap-6">
					<!-- <div class="grid gap-3">
                        <Calendar class="rounded-md border shadow" />
                    </div> -->

					<div class="grid gap-3">
						<Label for="name">Employee</Label>
						<Select.Root>
							<Select.Trigger>
								<Select.Value placeholder="Select a fruit" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Fruits</Select.Label>
									{#each fruits as fruit}
										<Select.Item value={fruit.value} label={fruit.label}>{fruit.label}</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
							<Select.Input name="favoriteFruit" />
						</Select.Root>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div class="grid gap-3">
							<Label for="name">Check In</Label>
							<Input id="name" class="block" type="time" placeholder="price " value="" />
						</div>
						<div class="grid gap-3">
							<Label for="name">Check Out</Label>
							<Input id="name" class="block" type="time" placeholder="price " value="" />
						</div>
					</div>
				</div>
			</div>
			<div class="grid gap-6">
				<div class="grid gap-3">
					<Label for="name">Nosil</Label>
					<Select.Root>
						<Select.Trigger>
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Nosil</Select.Label>
								{#each ['HSD', 'MS', 'MS1', 'HSD1'] as fruit}
									<Select.Item value={fruit} label={fruit}>{fruit}</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="favoriteFruit" />
					</Select.Root>
				</div>
				<div class="grid grid-cols-3 items-end gap-2">
					<div class="grid gap-3">
						<Label for="name">Opening</Label>
						<Input id="name" class="block" type="number" placeholder="Reading " value="" />
					</div>
					<div class="grid gap-3">
						<Label for="name">Closing</Label>
						<Input id="name" class="block" type="number" placeholder="Reading " value="" />
					</div>
					<div class="grid gap-3">
						<Button>Add</Button>
					</div>
				</div>
			</div>
		</div>
		<ScrollArea class="w-100 mt-6 h-56">
			<h6 class="sticky font-extrabold">Reading</h6>

			{#each [1, 2, 3] as item}
				<div class="my-2 grid grid-cols-6 gap-2 rounded-lg border p-2">
					<div>
						<h6 class=" text-xs text-muted-foreground">Nossil</h6>
						<h6 class="text-sm font-semibold text-black">HSD</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Type</h6>
						<h6 class="text-sm font-semibold text-black">Petrol</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Opening</h6>
						<h6 class="text-sm font-semibold text-black">11222</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Closing</h6>
						<h6 class="text-sm font-semibold text-black">11222</h6>
					</div>
					<div>
						<h6 class=" text-xs text-muted-foreground">Liter</h6>
						<h6 class="text-sm font-semibold text-orange-400">11222</h6>
					</div>
					<div class="text-right">
						<h6 class=" text-xs text-muted-foreground">Total</h6>
						<h6 class="text-sm font-semibold text-green-600">$11222</h6>
					</div>
				</div>
			{/each}
		</ScrollArea>
	</Card.Content>
	<Card.Footer class="justify-end">
		<Button
			on:click={() => {
				componentSide.set(null);
			}}
			variant="outline"
			class="mr-3">Cancel</Button
		>
		<Button>Submit</Button>
	</Card.Footer>
	<!-- </xCard.Root> -->
</div>
