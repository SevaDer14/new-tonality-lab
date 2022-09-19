<script lang="ts">
	export let data: string;
</script>

<div class="half-screen">
	<p>{data}</p>
</div>

<style>
	.half-screen {
		width: 100%;
		height: calc(50vh - 1px);
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid lightgrey;
	}
</style>
