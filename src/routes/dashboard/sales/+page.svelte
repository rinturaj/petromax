<script lang="ts">
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { componentSide } from '../../../lib/component.store';
	import SaleOrder from '../../../lib/components/custom/saleOrder.svelte';
	import { CalendarIcon, Edit, Expand } from 'lucide-svelte';
	import { Trash } from 'svelte-radix';
	import Input from '../../../lib/components/ui/input/input.svelte';
	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import SaleOrderView from '../../../lib/components/custom/saleOrderView.svelte';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = undefined;
	componentSide.set(null);

	function addComponent() {
		componentSide.set(SaleOrder);
	}
	function viewSales() {
		componentSide.set(SaleOrderView);
	}
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Your Orders</Card.Title>
					<Card.Description class="max-w-lg text-balance leading-relaxed">
						Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful
						Analysis.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button on:click={addComponent}>Create New Order</Button>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>This Week</Card.Description>
					<Card.Title class="text-4xl">$1329</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs text-muted-foreground">+25% from last week</div>
				</Card.Content>
				<Card.Footer>
					<Progress value={25} aria-label="25% increase" />
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>This Month</Card.Description>
					<Card.Title class="text-3xl">$5,329</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs text-muted-foreground">+10% from last month</div>
				</Card.Content>
				<Card.Footer>
					<Progress value={12} aria-label="12% increase" />
				</Card.Footer>
			</Card.Root>
		</div>
		<div class="flex items-center">
			<div>
				<Popover.Root>
					<Popover.Trigger asChild let:builder>
						<Button
							variant="outline"
							class={cn(
								'w-[240px] justify-start text-left font-normal',
								!value && 'text-muted-foreground'
							)}
							builders={[builder]}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<Calendar bind:value />
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" size="sm" class="h-7 gap-1 text-sm" builders={[builder]}>
							<ListFilter class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only">Filter</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Filter by</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.CheckboxItem checked>Fulfilled</DropdownMenu.CheckboxItem>
						<DropdownMenu.CheckboxItem>Declined</DropdownMenu.CheckboxItem>
						<DropdownMenu.CheckboxItem>Refunded</DropdownMenu.CheckboxItem>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
					<File class="h-3.5 w-3.5" />
					<span class="sr-only sm:not-sr-only">Export</span>
				</Button>
			</div>
		</div>
		<Card.Root>
			<Card.Header class="flex flex-row justify-between px-7">
				<div>
					<Card.Title>Sales</Card.Title>
					<Card.Description>showing 22-07-2024 date data</Card.Description>
				</div>
				<div>
					<Input type="search" placeholder="search"></Input>
				</div>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head class="hidden sm:table-cell">Date</Table.Head>
							<Table.Head class="hidden sm:table-cell">Shift Time</Table.Head>
							<Table.Head class="hidden md:table-cell">Total</Table.Head>
							<Table.Head class="hidden md:table-cell">Discrepancy</Table.Head>
							<Table.Head class="text-right">Action</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each [1, 2, 3] as item}
							<Table.Row class="">
								<Table.Cell>
									<div class="font-medium">Liam Johnson</div>
								</Table.Cell>
								<Table.Cell class="hidden sm:table-cell">2023-06-23</Table.Cell>
								<Table.Cell class="hidden sm:table-cell">
									<Badge class="mx-1 text-xs" variant="default">23:00</Badge>-
									<Badge class="text-xs" variant="default">5:00</Badge>
								</Table.Cell>
								<Table.Cell class="hidden md:table-cell">$250.00</Table.Cell>
								<Table.Cell class="hidden text-green-700 md:table-cell">+$250.00</Table.Cell>
								<Table.Cell class="text-right">
									<Button on:click={addComponent} size="icon" variant="ghost">
										<Edit size={16}></Edit>
									</Button>
									<Button on:click={viewSales} size="icon" variant="outline">
										<Expand size={16}></Expand>
									</Button>
									<Button size="icon" variant="destructive">
										<Trash size={16}></Trash>
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
