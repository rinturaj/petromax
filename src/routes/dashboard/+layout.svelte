<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import { Separator } from '$lib/components/ui/separator';
	import Nav from '$lib/components/custom/nav.svelte';
	import { primaryRoutes, salesRoutes } from '../../lib/config';
	import AccountSwitcher from '../../lib/components/custom/account-switcher.svelte';
	import { cn } from '../../lib/utils';
	import { page } from '$app/stores';
	import ScrollArea from '../../lib/components/ui/scroll-area/scroll-area.svelte';
	import { componentSide } from '../../lib/component.store';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '../../lib/components/ui/button/button.svelte';

	export let defaultLayout = [265, 655, 340];
	export let defaultCollapsed = false;
	export let navCollapsedSize = 4;

	let selectedAcount: any;

	let isCollapsed = defaultCollapsed;

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}
</script>

<div class="hidden h-screen md:block">
	<Resizable.PaneGroup
		direction="horizontal"
		{onLayoutChange}
		class="h-full max-h-[800px] items-stretch"
	>
		<Resizable.Pane
			defaultSize={defaultLayout[0]}
			collapsedSize={navCollapsedSize}
			collapsible
			minSize={15}
			maxSize={20}
			{onCollapse}
			{onExpand}
		>
			<div
				class={cn(
					'm-1 flex h-[52px] items-center rounded-md bg-slate-950 font-extrabold text-white',
					isCollapsed ? 'h-[52px] justify-center' : 'justify-start px-2'
				)}
			>
				{#if isCollapsed}
					<h5>P</h5>
				{:else}
					<h5>Petromax</h5>
				{/if}
			</div>
			<Separator />
			<div
				class={cn('flex h-[52px] items-center justify-center', isCollapsed ? 'h-[52px]' : 'px-2')}
			>
				<AccountSwitcher bind:selectedAccount={selectedAcount} {isCollapsed} />
			</div>
			<Separator />
			<Nav {isCollapsed} routes={selectedAcount?.label == 'Sales' ? salesRoutes : primaryRoutes} />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30} class="bg-slate-100">
			<ScrollArea class="h-screen">
				<slot></slot>
			</ScrollArea>
		</Resizable.Pane>
		<!-- <Resizable.Handle withHandle />
		<Resizable.Pane
			defaultSize={defaultLayout[2]}
			minSize={20}
			class="flex items-start bg-slate-50 pt-4"
		>
			<svelte:component this={$componentSide} />
		</Resizable.Pane> -->
	</Resizable.PaneGroup>
</div>

<Dialog.Root open={$componentSide != null}>
	<Dialog.Content class="max-w-5xl p-0">
		<!-- <Dialog.Header>
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header> -->
		<svelte:component this={$componentSide} />

		<!-- <Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer> -->
	</Dialog.Content>
</Dialog.Root>
