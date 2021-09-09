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

    private static Connection getConnection() throws SQLException {
        // establish connection
        return DriverManager.getConnection("jdbc:mysql://localhost:3306/self_driving_car_service",
                "root", "***REMOVED***");
    }

    public static UserInfo checkUser(String username) {
        UserInfo user = new UserInfo();
        user.userName = username;
        try {
            // create a statement
            PreparedStatement userExist = getConnection().prepareStatement("SELECT userID FROM users " +
                    "WHERE username = ?");
            userExist.setString(1, username);
            ResultSet uIDexist = userExist.executeQuery();
            if (uIDexist.next()) {
                int userID = uIDexist.getInt(1);
                PreparedStatement prepStmt = getConnection().prepareStatement("SELECT password, salt FROM authentication " +
                        "WHERE userID = ?");
                prepStmt.setInt(1, userID);
                ResultSet rset = prepStmt.executeQuery();
                rset.next();
                user.userEncryptedPassword = rset.getString("password");
                user.userSalt = rset.getString("salt");
            } else {
                System.out.println("\nNot found!");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return user;
    }

    public static void addUser(String username, String password, String salt, String date) {
        try {
            // insert statement
            PreparedStatement userInfoIn = getConnection().prepareStatement("INSERT INTO users (username, dateCreated)" +
                    "VALUES (?, ?)");
            PreparedStatement userAuthIn = getConnection().prepareStatement("INSERT INTO authentication (password, salt)" +
                    "VALUES (?, ?)");
            userInfoIn.setString(1, username);
            userInfoIn.setString(2, date);
            userInfoIn.executeUpdate();

            userAuthIn.setString(1, password);
            userAuthIn.setString(2, salt);
            userAuthIn.executeUpdate();

            System.out.println("\nUser created.");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
