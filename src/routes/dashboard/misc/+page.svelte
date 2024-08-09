<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Copy from 'lucide-svelte/icons/copy';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import Package from 'lucide-svelte/icons/package';
	import Package2 from 'lucide-svelte/icons/package-2';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart';
	import Truck from 'lucide-svelte/icons/truck';
	import UsersRound from 'lucide-svelte/icons/users-round';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Label from '../../../lib/components/ui/label/label.svelte';
	import { ArrowBigRight } from 'lucide-svelte';
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40 p-4">
	<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
		<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
			<Card.Root class="sm:col-span-2">
				<Card.Header class="pb-3">
					<Card.Title>Update Price</Card.Title>
					<Card.Description>last updated on 22-05-1993</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Label>
						Petrol Price
						<Input class="mt-1" placeholder="price"></Input>
					</Label>
					<Label class="ml-2">
						Diesel Price
						<Input class="mt-1" placeholder="price"></Input>
					</Label>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Petrol Price</Card.Description>
					<Card.Title class="text-4xl">$1329</Card.Title>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>Diesel Price</Card.Description>
					<Card.Title class="text-3xl">$5,329</Card.Title>
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
