package com.codecool.web.dao.database;

import com.codecool.web.dao.HourDao;
import com.codecool.web.model.Hour;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

class DatabaseHourDao extends AbstractDaoFactory implements HourDao {

    DatabaseHourDao(Connection connection) {
        super(connection);
    }

    @Override
    public void addHour(int day_id, int value) throws SQLException {

    }

    @Override
    public void deleteHour(int id) throws SQLException {

    }

    @Override
    public Hour findHourById(int id) throws SQLException {
        return null;
    }

    @Override
    public List<Hour> findHoursByDayId(int dayId) throws SQLException {
        return null;
    }


}
