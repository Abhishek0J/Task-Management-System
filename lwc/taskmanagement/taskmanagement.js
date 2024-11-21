import { LightningElement, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import createTask from '@salesforce/apex/TaskController.createTask';
import updateTaskStatus from '@salesforce/apex/TaskController.updateTaskStatus';

export default class TaskManager extends LightningElement {
    @track tasks = [];
    @track taskName = '';
    @track description = '';
    @track dueDate = '';
    @track priority = 'Low';
    @track selectedPriority = '';
    @track selectedStatus = '';
    @track dueDateError = '';

    priorityOptions = [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
    ];

    statusOptions = [
        { label: 'New', value: 'New' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' }
    ];

    columns = [
        { label: 'Task Name', fieldName: 'Name' },
        { label: 'Description', fieldName: 'Description__c' },
        { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
        { label: 'Priority', fieldName: 'Priority__c' },
        { label: 'Status', fieldName: 'Status__c', type: 'picklist' }
    ];

    connectedCallback() {
        this.fetchTasks();
    }

    fetchTasks() {
        getTasks({ priority: this.selectedPriority, status: this.selectedStatus }).then(result => {
            this.tasks = result;
        });
    }

    handleInput(event) {
        const field = event.target.label;
        if (field === 'Task Name') {
            this.taskName = event.target.value;
        } else if (field === 'Description') {
            this.description = event.target.value;
        } else if (field === 'Due Date') {
            this.dueDate = event.target.value;
            this.dueDateError = ''; 
        } else if (field === 'Priority') {
            this.priority = event.target.value;
        }
    }

    createTask() {
        // Validate if the due date is in the past
        if (this.dueDate && new Date(this.dueDate) < new Date()) {
            this.dueDateError = 'Due Date cannot be in the past.';
            return;
        }

        const task = {
            Name: this.taskName,
            Description__c: this.description,
            Due_Date__c: this.dueDate,
            Priority__c: this.priority
        };
        createTask({ task }).then(() => {
            this.fetchTasks();
        });
    }

    filterTasks(event) {
        const label = event.target.label;
        if (label === 'Filter by Priority') {
            this.selectedPriority = event.target.value;
        } else if (label === 'Filter by Status') {
            this.selectedStatus = event.target.value;
        }
        this.fetchTasks();
    }
}
