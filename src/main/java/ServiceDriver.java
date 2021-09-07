// main driver of program

import java.io.IOException;
import java.sql.*;

public class ServiceDriver {
    public static void main(String[] args) throws IOException, InterruptedException {
        System.out.println("Welcome to a Self Driving Car Reservation Service!");
        GeoLocation location = new GeoLocation();
        System.out.println(location.getLatLon());
        System.out.println("Listing users in database:");

        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/self_driving_car_service", "root", "team2");
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
