public with sharing class TaskManagerController {
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        return [
            SELECT Id, Name, Description__c, Due_Date__c, Priority__c, Status__c
            FROM Task__c
            LIMIT 100
        ];
    }
}
