import java.sql.*;

public class Database {
    public static void newUser(String username, String password, String date) {
        try {
            // explicitly load JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            // establish connection
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/self_driving_car_service", "root", "team2");
            // create a statement
            PreparedStatement preparedStmt = connection.prepareStatement("INSERT INTO users (username, password, dateCreated)" + "VALUES (?, ?, ?)");
            preparedStmt.setString(1, username);
            preparedStmt.setString(2, password);
            preparedStmt.setString(3, date);
            preparedStmt.executeUpdate();
            System.out.println("User created.");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void authentication(String username, String password) {
        try {
            // explicitly load JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            // establish connection
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/self_driving_car_service", "root", "team2");
            // create a statement
            PreparedStatement preparedStmt = connection.prepareStatement("SELECT username, password FROM users WHERE username = ? && password = ?");
            preparedStmt.setString(1, username);
            preparedStmt.setString(2, password);
            ResultSet rset = preparedStmt.executeQuery();
            if (rset.next()) {
//                String dbUsername = rset.getString(1);
//                String dbPassword = rset.getString(2);
                System.out.println("Verified!");
            } else {
                System.out.println("Not found.");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
