<script>
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { get } from 'svelte/store'
	import { todos } from './stores'

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	let todoListt = get(todos)
	let todoList = JSON.parse(todoListt)
	
	console.log(todoList[0])

	let uid = todoList.length + 1;

	function add(input) {
		const todo = {
			id: uid++,
			done: false,
			description: input.value
		};
		todoList = [todo, ...todoList];
		console.log(todoList)
		let newtodoListString = JSON.stringify(todoList)
		todos.set(newtodoListString)
		input.value = '';
	}

	function remove(todo) {
		todoList = todoList.filter(t => t !== todo);
		let newtodoList = JSON.stringify(todoList)
		console.log(todoList)
		todos.set(newtodoList)
		console.log(newtodoList)
	}
</script>

<h1>GrandMa's ToDo's</h1>

<div class='board'>
	<input
		class="new-todo"
		placeholder="what needs to be done?"
		on:keydown="{event => event.key === 'Enter' && add(event.target)}"
	>

	<div class='left'>
		<h2>todo</h2>
		{#each todoList as todo (todo.id)}
			{#if !todo.done }
				<label
					in:receive="{{key: todo.id}}"
					out:send="{{key: todo.id}}"
					
				>
					<input type=checkbox bind:checked={todo.done}>
					{todo.description}
					<button on:click="{() => remove(todo)}">x</button>
				</label>
			{/if}
		{/each}
	</div>

	<div class='right'>
		<h2>done</h2>
		{#each todoList as todo (todo.id)}
			{#if todo.done}
			<label
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
			>
				<input type=checkbox bind:checked={todo.done}>
				{todo.description}
				<button on:click="{() => remove(todo)}">x</button>
			</label>
			{/if}
		{/each}
	</div>
</div>

<style>
    h1 {
        text-align: center;
    }
    
	.new-todo {
		font-size: 1.4em;
		width: 100%;
		margin: 2em 0 1em 0;
	}

	.board {
		max-width: 36em;
		margin: 0 auto;
	}

	.left, .right {
		float: left;
		width: 50%;
		padding: 0 1em 0 0;
		box-sizing: border-box;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
		user-select: none;
	}

	label {
		top: 0;
		left: 0;
		display: block;
		font-size: 1em;
		line-height: 1;
		padding: 0.5em;
		margin: 0 auto 0.5em auto;
		border-radius: 2px;
		background-color: #eee;
		user-select: none;
	}

	input { margin: 0 }

	.right label {
		background-color: rgb(180,240,100);
	}

	button {
		float: right;
		height: 1em;
		box-sizing: border-box;
		padding: 0 0.5em;
		line-height: 1;
		background-color: transparent;
		border: none;
		color: rgb(170,30,30);
		opacity: 0;
		transition: opacity 0.2s;
	}

	label:hover button {
		opacity: 1;
	}
</style>