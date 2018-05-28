package com.codecool.web.service.simple;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.TaskHourDao;
import com.codecool.web.dao.database.AbstractDaoFactory;
import com.codecool.web.exception.TaskAlreadyExistsException;
import com.codecool.web.model.Task;
import com.codecool.web.service.TaskService;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class SimpleTaskService implements TaskService {

    private final TaskDao taskDao;
    private final TaskHourDao taskHourDao;

    public SimpleTaskService(Connection connection) {
        taskDao = (TaskDao) AbstractDaoFactory.getDao("task", connection);
        taskHourDao = (TaskHourDao) AbstractDaoFactory.getDao("taskHour",connection);

    }

    @Override
    public void addTask(int userId, String title, String description) throws SQLException {
        taskDao.add(userId, title, description);
    }

    @Override
    public void deleteTask(int taskId) throws SQLException {
        taskHourDao.deleteByTaskId(taskId);
        taskDao.delete(taskId);

    }

    @Override
    public void update(int taskId, String title, String description) throws SQLException, TaskAlreadyExistsException {
        Task task = taskDao.findById(taskId);
        Task check = taskDao.findByTitle(title);
        String currentTitle = task.getTitle();
        String currentDescription = task.getDescription();

        if (currentTitle.equals(title) && !currentDescription.equals(description)) {
            taskDao.updateDescription(taskId, description);
        } else if (!currentTitle.equals(title) && currentDescription.equals(description) && check == null) {
            taskDao.updateTitle(taskId, title);
        } else if (!currentTitle.equals(title) && !currentDescription.equals(description) && check == null) {
            taskDao.updateTitle(taskId, title);
            taskDao.updateDescription(taskId, description);
        }else if(check != null){
            throw new TaskAlreadyExistsException();
        }
    }

    @Override
    public Task findById(int taskId) throws SQLException {
        return taskDao.findById(taskId);
    }

    @Override
    public List<Task> findAll() throws SQLException {
        return taskDao.findAll();
    }

    @Override
    public List<Task> findAllByUserId(int userId) throws SQLException {
        return taskDao.findByUserId(userId);
    }
}
