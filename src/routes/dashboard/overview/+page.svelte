<script lang="ts">
	import Activity from 'lucide-svelte/icons/activity';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
	import Download from 'lucide-svelte/icons/download';
	import Users from 'lucide-svelte/icons/users';
	// import {
	// 	DashboardMainNav,
	// 	Overview,
	// 	RecentSales,
	// 	Search,
	// 	TeamSwitcher,
	// 	UserNav,
	// } from "./index.js";
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import DatePickerWithRange from '../../../lib/components/custom/date-picker-with-range.svelte';
	import { getLocalTimeZone, type DateValue, DateFormatter } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { liveQuery } from 'dexie';
	import { db } from '../../../database/db';
	import type { SaleModel } from '../../../database/model';
	import SalesOverview from '../../../lib/components/custom/dashboard/salesOverview.svelte';
	import SalesChart from '../../../lib/components/custom/dashboard/salesChart.svelte';
	import Analytics from '../../../lib/components/custom/dashboard/Analytics.svelte';

	$: salesList = liveQuery(async () => {
		console.log(startDate, endDate);
		return await db.sales
			.where('salesDate')
			.between(startDate, endDate, true, true)
			.and((x) => (filterBy != '' ? x.employeeName == filterBy : true))
			.sortBy(sortBy);
	});

	$: nameList = liveQuery(async () => {
		return [...new Set((await db.sales.toArray()).map((x) => x.employeeName))];
	});
	$: revenueMonth = $salesList
		? $salesList.reduce(
				(sum: any, x: SaleModel) => {
					return {
						revenue: Number(sum.revenue) + Number(x.actuals),
						discrepancy: Number(sum.discrepancy) + Number(x.discrepancy),
						collected: Number(sum.collected) + Number(x.totalCollection),
						inhand: Number(sum.inhand) + Number(x.inHand),
						credit: Number(sum.credit) + Number(x.credit),
						discrepancyPer: (
							((Number(sum.discrepancy) + Number(x.discrepancy)) * 100) /
							(Number(sum.revenue) + Number(x.actuals))
						).toFixed(2)
					};
				},
				{
					revenue: 0,
					discrepancy: 0,
					discrepancyPer: 0,
					collected: 0,
					inhand: 0,
					credit: 0
				}
			)
		: {
				revenue: 0,
				discrepancy: 0,
				collected: 0,
				inhand: 0,
				credit: 0,
				discrepancyPer: 0
			};

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let dateValue: DateRange;
	let sortBy: string = 'salesDate';
	let filterBy: string = '';

	$: startDate =
		dateValue != null && dateValue.start != null
			? dateValue.start?.toDate(getLocalTimeZone())
			: new Date();
	$: endDate =
		dateValue != null && dateValue.end != null
			? dateValue.end?.toDate(getLocalTimeZone())
			: new Date();
</script>

<div class="hidden flex-col md:flex">
	<div class="border-b">
		<!-- <div class="flex h-16 items-center px-4">
			<TeamSwitcher />
			<DashboardMainNav class="mx-6" />
			<div class="ml-auto flex items-center space-x-4">
				<Search />
				<UserNav />
			</div>
		</div> -->
	</div>
	<div class="flex-1 space-y-4 p-8 pt-6">
		<div class="flex items-center justify-between space-y-2">
			<h2 class="text-3xl font-bold tracking-tight">Overview</h2>
			<div class="flex items-center space-x-2">
				<DatePickerWithRange bind:value={dateValue} />
				<Button size="sm">
					<Download class="mr-2 h-4 w-4" />
					Download
				</Button>
			</div>
		</div>
		<Tabs.Root value="overview" class="space-y-4">
			<Tabs.List>
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<!-- <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
				<Tabs.Trigger value="notifications">Notifications</Tabs.Trigger> -->
			</Tabs.List>
			<Tabs.Content value="overview" class="space-y-4">
				<SalesOverview {revenueMonth}></SalesOverview>
				<SalesChart {salesList}></SalesChart>
			</Tabs.Content>
			<Tabs.Content value="analytics" class="space-y-4">
				<Analytics {salesList}></Analytics>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
