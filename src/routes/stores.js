import { writable } from 'svelte/store';
import  { browser } from '$app/env';

console.log(browser)
const defaults_txt = [
    { id: 1, done: false, description: 'write some docs' },
    { id: 2, done: false, description: 'start writing JSConf talk' },
    { id: 3, done: true, description: 'buy some milk' },
    { id: 4, done: false, description: 'mow the lawn' },
    { id: 5, done: false, description: 'feed the turtle' },
    { id: 6, done: false, description: 'fix some bugs' },
]
const defaults = JSON.stringify(defaults_txt)

console.log(defaults)

export const todos = writable(
    browser && (localStorage.getItem("todos") || defaults)

)

todos.subscribe((val) => browser && (localStorage.todos = val))