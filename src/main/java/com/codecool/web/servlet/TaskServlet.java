package com.codecool.web.servlet;

import com.codecool.web.dto.UserDto;
import com.codecool.web.exception.TaskAlreadyExistsException;
import com.codecool.web.model.Schedule;
import com.codecool.web.model.Task;
import com.codecool.web.model.User;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.simple.SimpleScheduleService;
import com.codecool.web.service.simple.SimpleTaskService;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/protected/task")
public class TaskServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
            try (Connection connection = getConnection(req.getServletContext())) {
                TaskService taskService = new SimpleTaskService(connection);
                ScheduleService scheduleService = new SimpleScheduleService(connection);
                User user = getUser(req);
                int userId = user.getId();
                List<Task> tasks ;
                String currentId = req.getParameter("currentScheduleId");
                if(currentId == null){
                    currentId = (String) req.getAttribute("currentScheduleId");
                    req.removeAttribute("currentScheduleId");
                }
                if (currentId == null || currentId.equals("null")) {
                    tasks = taskService.findAllByUserId(userId);
                }
                else{
                    tasks = taskService.findAllByUserAndScheduleId(userId,Integer.parseInt(currentId));
                }
                List<Schedule> schedules = scheduleService.findAllByUserId(userId);

                UserDto userDto =  new UserDto(user, tasks, schedules);
            sendMessage(resp, HttpServletResponse.SC_OK, userDto);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new SimpleTaskService(connection);
            User user = getUser(req);
            int userId = user.getId();
            String taskTitle = req.getParameter("title");
            String taskDescription = req.getParameter("description");
            String taskColor = req.getParameter("color");

            taskService.addTask(userId, taskTitle, taskDescription, taskColor);

            doGet(req, resp);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        } catch (TaskAlreadyExistsException e) {
            sendMessage(resp,HttpServletResponse.SC_BAD_REQUEST,e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new SimpleTaskService(connection);

            JsonParser jsonParser = objectMapper.getFactory().createParser(req.getInputStream());
            Task task = objectMapper.readValue(jsonParser, Task.class);
            taskService.update(task);

            if(task.getScheduleId() != null){
                req.setAttribute("currentScheduleId",task.getScheduleId());
            }

            doGet(req, resp);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (TaskAlreadyExistsException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new SimpleTaskService(connection);

            JsonParser jsonParser = objectMapper.getFactory().createParser(req.getInputStream());
            Task task = objectMapper.readValue(jsonParser, Task.class);

            if(task.getScheduleId() != null){
                req.setAttribute("currentScheduleId",task.getScheduleId());
            }

            taskService.deleteTask(task);



            doGet(req, resp);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}
