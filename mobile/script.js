const classNames = {
 	TODO_ITEM: 'todo-container',
	TODO_CHECKBOX: 'todo-checkbox',
	TODO_TEXT: 'todo-text',
	TODO_DELETE: 'todo-delete'	
}

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

function TodoItem(id, task){
	this.id = id
	this.task = task  		
}

function TodoList( options ){
	this.items = []
	this.onAdd = options.onAdd || TodoList.prototype.onAdd
	this.onRemove = options.onRemove || TodoList.prototype.onRemove
	this.canRemove = options.canRemove || TodoList.prototype.canRemove
}

TodoList.prototype.add = function(taskName){
	let task = new TodoItem(this.items.length+1, taskName)
	this.items.push(task)
	if (this.onAdd !== undefined)
		this.onAdd(task)
	return task
}

TodoList.prototype.canRemove = function(task){
	return true
}

TodoList.prototype.remove = function(taskId){
	let index = -1
	const found = this.items.find((x) => { 
		index++
		return x.id == taskId 
	})
	if(found && this.canRemove(found)){
		this.items.splice(index, 1)
		if (this.onRemove !== undefined)
			this.onRemove(taskId)
	}
}


TodoList.prototype.onAdd = function(datatask){
	updateStatus()
}

TodoList.prototype.onRemove = function(taskId){
	updateStatus()
}

let todo = new TodoList({ 
	onAdd : addToUI,
	onRemove: removeFromUI,
	canRemove: confirmRemovalOf
})


function newTodo() {  
	let taskName = prompt('Input the task name', 'New Task')
	if (!taskName)
		alert('The task name is required')
	else{
		todo.add(taskName)
	}
}

function addToUI(task){		
	let item = document.querySelector('.todo-list li[data-task-id="{0}"]'.replace('{0}', task.id))
	if(item === null){
		addTaskToUI(task)		
	}
	updateStatus()
}

function removeFromUI(taskId){
	const item = document.querySelector('.todo-list li[data-task-id="{0}"'.replace('{0}', taskId))
	if (item)
		item.parentNode.removeChild(item)		
	updateStatus()
}

function confirmRemovalOf(task){
	return (confirm('Remove "{0}".\nAre you sure?'.replace('{0}', task.task)))
}

function updateStatus(){
	const count = todo.items.length
	const checkedCount = document.querySelectorAll('.todo-list input[type=checkbox]:checked').length	
	itemCountSpan.innerText = count
	uncheckedCountSpan.innerText = count - checkedCount
}

function addTaskToUI(task){

	const listItem = document.createElement('li')
	const label = document.createElement('label')
	const span = document.createElement('span')
	const checkbox = document.createElement('input')
	const button = document.createElement('button')
	
	with(checkbox){
		type = 'checkbox', 
		className = classNames.TODO_CHECKBOX				
	}	
	
	with(label){		
		appendChild(checkbox)
		appendChild(span)
		children[1].innerHTML = task.task	
	}

	with (button){
		innerText = 'Delete'
		addEventListener('click', (e) =>{
			debugger
			todo.remove(e.target.parentElement.dataset.taskId)
		})
	}

	with(listItem){
		dataset.taskId = task.id
		className = classNames.TODO_ITEM
		appendChild(label)		
		appendChild(button)
	}

	list.appendChild(listItem)
	checkbox.addEventListener('change', (e)=>{ updateStatus() })
}

