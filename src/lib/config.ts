import { Box, DollarSign, icons, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import * as Icons from './icons';
import { Boxes } from 'lucide-svelte';
import { Fuel } from 'lucide-svelte';
import { PaintBucket } from 'lucide-svelte';

export type Route = {
	title: string;
	label: string;
	link: string;
	icon: ComponentType<Icon>;
	variant: 'default' | 'ghost';
};

export const salesRoutes: Route[] = [
	{
		title: 'Sales',
		label: '',
		link: '/dashboard/sales',
		icon: Box,
		variant: 'ghost'
	},
	{
		title: 'Expenses ',
		label: '',
		link: '/dashboard/expenses',
		icon: DollarSign,
		variant: 'ghost'
	}
];
export const primaryRoutes: Route[] = [
	{
		title: 'Stock',
		label: '',
		link: '/dashboard/stock',
		icon: Box,
		variant: 'ghost'
	},
	{
		title: 'Oil Stock',
		label: '',
		link: '/dashboard/oilstock',

		icon: PaintBucket,
		variant: 'ghost'
	},
	{
		title: 'Staff',
		label: '',
		link: '/dashboard/staff',

		icon: Icons.Users,
		variant: 'ghost'
	},
	{
		title: 'Nossil',
		label: '23',
		link: '/dashboard/nossil',

		icon: Fuel,
		variant: 'ghost'
	}
];
