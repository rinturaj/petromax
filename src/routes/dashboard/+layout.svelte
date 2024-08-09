<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import { Separator } from '$lib/components/ui/separator';
	import Nav from '$lib/components/custom/nav.svelte';
	import { primaryRoutes, salesRoutes } from '../../lib/config';
	import AccountSwitcher from '../../lib/components/custom/account-switcher.svelte';
	import { cn } from '../../lib/utils';
	import { page } from '$app/stores';
	import ScrollArea from '../../lib/components/ui/scroll-area/scroll-area.svelte';
	import { componentSide, isAuthenticated, logout } from '../../lib/component.store';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '../../lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { derived } from 'svelte/store';
	import { FolderSync, LogOut } from 'lucide-svelte';

	export let defaultLayout = [265, 655, 340];
	export let defaultCollapsed = false;
	export let navCollapsedSize = 4;

	export let data;

	onMount(() => {
		if (!$isAuthenticated) {
			goto('/');
		}
	});

	console.log(data);

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
	<Resizable.PaneGroup direction="horizontal" {onLayoutChange} class="h-full items-stretch">
		<Resizable.Pane
			defaultSize={defaultLayout[0]}
			collapsedSize={navCollapsedSize}
			collapsible
			minSize={15}
			maxSize={20}
			{onCollapse}
			{onExpand}
		>
			<div class="flex h-full flex-col justify-between">
				<div>
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
						class={cn(
							'flex h-[52px] items-center justify-center',
							isCollapsed ? 'h-[52px]' : 'px-2'
						)}
					>
						<AccountSwitcher bind:selectedAccount={selectedAcount} {isCollapsed} />
					</div>
					<Separator />
					<Nav
						{isCollapsed}
						routes={selectedAcount?.label == 'Sales' ? salesRoutes : primaryRoutes}
					/>
				</div>
				<div>
					<Separator />
					<div class="p-2 text-center">
						{#if isCollapsed}
							<Button
								on:click={() => {
									logout();
									goto('/');
								}}
								variant="outline"
								size="icon"><LogOut></LogOut></Button
							>
						{:else}
							<Button
								on:click={() => {
									logout();
									goto('/');
								}}
								class="w-full"
								variant="outline"
								size="sm"
							>
								<LogOut class="mr-2" size={14}></LogOut>Logout</Button
							>
						{/if}
					</div>
					<Separator />
					<div class="p-2 text-center">
						{#if isCollapsed}
							<Button variant="outline" size="icon">
								<FolderSync></FolderSync>
							</Button>
						{:else}
							<Button class="w-full" variant="outline" size="sm">
								<FolderSync class="mr-2" size={14}></FolderSync>
								DB Sync</Button
							>
						{/if}
					</div>
				</div>
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30} class="bg-slate-100">
			<ScrollArea class="h-screen">
				<slot></slot>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>

<Dialog.Root open={$componentSide != null}>
	<Dialog.Content class="max-w-5xl p-0">
		<svelte:component this={$componentSide} />
	</Dialog.Content>
</Dialog.Root>
