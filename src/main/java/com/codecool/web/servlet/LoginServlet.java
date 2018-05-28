package com.codecool.web.servlet;

import com.codecool.web.dto.AdminDto;
import com.codecool.web.dto.UserDto;
import com.codecool.web.exception.UserNotFoundException;
import com.codecool.web.exception.WrongPasswordException;
import com.codecool.web.model.Schedule;
import com.codecool.web.model.Task;
import com.codecool.web.model.User;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.UserService;
import com.codecool.web.service.simple.SimpleScheduleService;
import com.codecool.web.service.simple.SimpleTaskService;
import com.codecool.web.service.simple.SimpleUserService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/login")
public final class LoginServlet extends AbstractServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            UserService userService = new SimpleUserService(connection);
            TaskService taskService = new SimpleTaskService(connection);
            ScheduleService scheduleService = new SimpleScheduleService(connection);

            String email = req.getParameter("email");
            String password = req.getParameter("password");

            User user = userService.login(email, password);
            String role = user.getRole();

            req.getSession().setAttribute("user", user);

            if (role.equals("admin")) {
                List<User> users = userService.findAll();
                sendMessage(resp, 200, new AdminDto(user, users));
            }

            List<Task> allTask = taskService.findAllByUserId(user.getId());
            List<Schedule> schedules = scheduleService.findAllByUserId(user.getId());

            sendMessage(resp, HttpServletResponse.SC_OK, new UserDto(user, allTask, schedules));
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        } catch (UserNotFoundException e) {
            sendMessage(resp, 404, "User not found");
        } catch (WrongPasswordException e) {
            sendMessage(resp, 409, "Wrong password");
        } catch (NoSuchAlgorithmException e) {
            sendMessage(resp, HttpServletResponse.SC_EXPECTATION_FAILED, "Unexpected error occurred");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            UserService userService = new SimpleUserService(connection);
            TaskService taskService = new SimpleTaskService(connection);
            ScheduleService scheduleService = new SimpleScheduleService(connection);

            int userId = Integer.parseInt(req.getParameter("id"));
            User user = userService.findById(userId);

            req.getSession().setAttribute("user", user);

            List<Task> allTask = taskService.findAllByUserId(user.getId());
            List<Schedule> schedules = scheduleService.findAllByUserId(user.getId());
            sendMessage(resp, HttpServletResponse.SC_OK, new UserDto(user, allTask, schedules));

        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}

