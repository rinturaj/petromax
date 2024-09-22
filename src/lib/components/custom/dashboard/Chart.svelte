<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart, {
		type BubbleDataPoint,
		type ChartTypeRegistry,
		type Point,
		type ChartType
	} from 'chart.js/auto'; // Import the auto package

	export let type: ChartType = 'bar'; // Chart type (e.g., bar, line, etc.)
	export let data: any; // Data for the chart
	export let options = {}; // Optional chart configuration

	$: if (chart) {
		chart.data = data; // Update chart data reactively
		chart.update(); // Re-render the chart
	}

	let chart: Chart; // This will hold the Chart.js instance
	let canvas: any; // Reference to the canvas element

	onMount(() => {
		// Initialize the chart when the component mounts
		chart = new Chart(canvas, {
			type,
			data,
			options
		});
	});

	onDestroy(() => {
		// Destroy the chart when the component is destroyed
		if (chart) {
			chart.destroy();
		}
	});
</script>

<canvas bind:this={canvas}></canvas>
<!-- Canvas element where the chart will be rendered -->
