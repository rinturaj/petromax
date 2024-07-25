import { Box, icons, type Icon } from 'lucide-svelte';
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

export const primaryRoutes: Route[] = [
	{
		title: 'Stock',
		label: '',
		link: 'stock',
		icon: Box,
		variant: 'ghost'
	},
	{
		title: 'Oil Stock',
		label: '',
		link: 'oilstock',

		icon: PaintBucket,
		variant: 'ghost'
	},
	{
		title: 'Staff',
		label: '',
		link: 'staff',

		icon: Icons.Users,
		variant: 'ghost'
	},
	{
		title: 'Nossil',
		label: '23',
		link: 'nossil',

		icon: Fuel,
		variant: 'ghost'
	}
];
