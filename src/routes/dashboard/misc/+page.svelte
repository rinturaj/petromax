<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { liveQuery } from 'dexie';
	import Label from '../../../lib/components/ui/label/label.svelte';
	import { db } from '../../../database/db';
	import Button from '../../../lib/components/ui/button/button.svelte';
	import { PriceApi } from '../../../database/dbactivity';

	$: price = liveQuery(async () => {
		let p = await db.price.get(1);

		return p;
	});
	let petrol: number;
	let diesel: number;
	let addPrice = () => {
		PriceApi.add(petrol, diesel);
	};
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Update Price</Card.Title>
					<Card.Description>last updated on 22-05-1993</Card.Description>
				</Card.Header>
				<Card.Footer class="flex items-end">
					<Label>
						Petrol Price
						<Input bind:value={petrol} class="mt-1" placeholder="price"></Input>
					</Label>
					<Label class="ml-2">
						Diesel Price
						<Input bind:value={diesel} class="mt-1" placeholder="price"></Input>
					</Label>
					<Button disabled={!petrol || !diesel} on:click={addPrice} class="ml-2">add</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Petrol Price</Card.Description>
					<Card.Title class="currency text-4xl">{$price?.petrol || 'NA'}</Card.Title>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Diesel Price</Card.Description>
					<Card.Title class="currency text-4xl">{$price?.diesel || 'NA'}</Card.Title>
				</Card.Header>
			</Card.Root>
			<Card.Root class="sm:col-span-4">
				<Card.Header class="pb-3">
					<Card.Title>Sync Your Database</Card.Title>
					<Card.Description class=" text-balance leading-relaxed">
						Select a folder to store your database backup. This backup file can be used to restore
						your data to IndexedDB in case of data loss in the browser.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Input type="file"></Input>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
</div>
