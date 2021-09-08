import java.sql.*;

public class Database {
    Database() {
        try {
            // explicitly load JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private Connection connect() throws SQLException {
        // establish connection
        return DriverManager.getConnection("jdbc:mysql://localhost:3306/self_driving_car_service",
                "root", "team2");
    }

    public void checkUser(String username, String password) {
        try {
            // create a statement
            PreparedStatement preparedStmt = connect().prepareStatement("SELECT username, password FROM users " +
                    "WHERE username = ? && password = ?");
            preparedStmt.setString(1, username);
            preparedStmt.setString(2, password);
            ResultSet rset = preparedStmt.executeQuery();
            if (rset.next()) {
//                String dbUsername = rset.getString(1);
//                String dbPassword = rset.getString(2);
                System.out.println("\nVerified!");
            } else {
                System.out.println("\nNot found!");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void addUser(String username, String password, String date) {
        try {
            // insert statement
            PreparedStatement prepStmt = connect().prepareStatement("INSERT INTO users (username, password, dateCreated)" +
                    "VALUES (?, ?, ?)");
            prepStmt.setString(1, username);
            prepStmt.setString(2, password);
            prepStmt.setString(3, date);
            prepStmt.executeUpdate();
            System.out.println("\nUser created.");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
