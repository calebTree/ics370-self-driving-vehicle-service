// main driver of program

import java.sql.*;

public class ServiceDriver {
    public static void main(String[] args) {
        System.out.println("Welcome to a Self Driving Car Service!");
        System.out.println("Listing users in database:");

        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/self_driving_car_service", "root", "***REMOVED***");
            Statement statement = connection.createStatement();
            ResultSet resultset = statement.executeQuery("SELECT * FROM users");

            while (resultset.next()) {
                System.out.println(resultset.getString("username"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
