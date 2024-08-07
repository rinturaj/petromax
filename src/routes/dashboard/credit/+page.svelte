<script lang="ts">
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { componentSide } from '../../../lib/component.store';
	import AddExpenses from '$lib/components/custom/addExpenses.svelte';

	const add = () => {
		componentSide.set(AddExpenses);
	};
	const settled = () => {
		componentSide.set(AddExpenses);
	};
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Your Expenses</Card.Title>
					<Card.Description class="max-w-lg text-balance leading-relaxed">
						Explore our comprehensive Expenses Dashboard for efficient tracking, analysis, and
						management of your financial outflows.
					</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button on:click={add}>Create New Expenses</Button>
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
		<Tabs.Root value="week">
			<div class="flex items-center">
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
			<Tabs.Content value="week">
				<Card.Root>
					<Card.Header class="px-7">
						<Card.Title>Expenses</Card.Title>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Name</Table.Head>
									<Table.Head class="hidden sm:table-cell">Vehicle Number</Table.Head>
									<Table.Head class="hidden sm:table-cell">Date</Table.Head>
									<Table.Head class="">Type</Table.Head>
									<Table.Head class="text-right">Amount</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row class="bg-accent">
									<Table.Cell>
										<div class="font-medium">Liam Johnson</div>
										<div class="font-normal">91xxxxxxxx</div>
									</Table.Cell>
									<Table.Cell class="hidden sm:table-cell">Sale</Table.Cell>
									<Table.Cell class="hidden sm:table-cell">22-33--33</Table.Cell>
									<Table.Cell class="hidden sm:table-cell">
										<Badge class="bg-red-400 text-xs" variant="default">Credit</Badge>
									</Table.Cell>
									<Table.Cell class="text-right">$250.00</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
