import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskManagerController.getTasks';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Description', fieldName: 'Description__c', type: 'text' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
    { label: 'Priority', fieldName: 'Priority__c', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
];

export default class DataTableComponent extends LightningElement {
    @track data = [];
    columns = columns; // No need to track static data
    error;

    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.data = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = [];
        }
    }
}
