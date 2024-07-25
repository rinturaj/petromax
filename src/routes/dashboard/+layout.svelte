<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import { Separator } from '$lib/components/ui/separator';
	import Nav from '$lib/components/custom/nav.svelte';
	import { primaryRoutes } from '../../lib/config';
	import AccountSwitcher from '../../lib/components/custom/account-switcher.svelte';
	import { cn } from '../../lib/utils';
	import { page } from '$app/stores';

	export let defaultLayout = [265, 440, 655];
	export let defaultCollapsed = false;
	export let navCollapsedSize: number = 4;

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
				<AccountSwitcher {isCollapsed} />
			</div>
			<Separator />
			<Nav {isCollapsed} routes={primaryRoutes} />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30}>
			<slot></slot>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[2]} minSize={30}>
			{#if $page.data.component}
				<svelte:component this={$page.data.component} />
			{/if}
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
