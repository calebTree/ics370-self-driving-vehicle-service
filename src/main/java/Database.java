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
                "root", "team2");
    }

    public static UserInfo checkUser(String username) throws SQLException {
        // create a statement
        PreparedStatement userExist = getConnection().prepareStatement("SELECT userID FROM users " +
                "WHERE username = ?");
        userExist.setString(1, username);
        ResultSet uIDexist = userExist.executeQuery();
        if (uIDexist.next()) {
            UserInfo user = new UserInfo();
            int userID = uIDexist.getInt(1);
            PreparedStatement prepStmt = getConnection().prepareStatement("SELECT password, salt FROM authentication " +
                    "WHERE userID = ?");
            prepStmt.setInt(1, userID);
            ResultSet rset = prepStmt.executeQuery();
            // set cursor to first record
            rset.next();
            user.userEncryptedPassword = rset.getString("password");
            user.userSalt = rset.getString("salt");
            return user;
        } else {
            // no user found by that username
            return null;
        }
    }

    public static void addUser(UserInfo user, String date) throws SQLException {
            // insert statement
            PreparedStatement userInfoIn = getConnection().prepareStatement("INSERT INTO users (username, dateCreated)" +
                    "VALUES (?, ?)");
            PreparedStatement userAuthIn = getConnection().prepareStatement("INSERT INTO authentication (password, salt)" +
                    "VALUES (?, ?)");
            userInfoIn.setString(1, user.userName);
            userInfoIn.setString(2, date);
            userInfoIn.executeUpdate();

            userAuthIn.setString(1, user.userEncryptedPassword);
            userAuthIn.setString(2, user.userSalt);
            userAuthIn.executeUpdate();

            System.out.println("\nUser [" + user.userName + "] saved.");
    }
}
