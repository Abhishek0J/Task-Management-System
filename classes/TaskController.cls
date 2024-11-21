public with sharing class TaskController {
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks(String priority, String status) {
        String userId = UserInfo.getUserId();
        String query = 'SELECT Id, Name, Description__c, Due_Date__c, Priority__c, Status__c, Assigned_To__c FROM Task__c WHERE Assigned_To__c = :userId';
        
        if (priority != null) {
            query += ' AND Priority__c = :priority';
        }
        if (status != null) {
            query += ' AND Status__c = :status';
        }
        return Database.query(query);
    }

    @AuraEnabled
    public static void createTask(Task__c task) {
        if (task.Due_Date__c < Date.today()) {
            throw new AuraHandledException('Due Date cannot be in the past.');
        }
        task.Assigned_To__c = UserInfo.getUserId();
        insert task;
    }

    @AuraEnabled
    public static void updateTaskStatus(Id taskId, String status) {
        Task__c task = [SELECT Id, Status__c FROM Task__c WHERE Id = :taskId LIMIT 1];
        task.Status__c = status;
        update task;
    }

    @AuraEnabled
    public static void deleteTask(Id taskId) {
        delete [SELECT Id FROM Task__c WHERE Id = :taskId];
    }
}
