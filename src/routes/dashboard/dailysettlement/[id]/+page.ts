import type { SalesSummary } from '../../../../database/model';

export function load({ params }) {
	let deleteExp: SalesSummary;

	return {
		id: params.id
	};
}
