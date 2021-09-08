// main account class for holding a user's information

public class Account {
//    private String username;
//    private String password;

    public static void login(String username, String password) {
        Database.authentication(username, password);
    }

    public static void createUser(String username, String password, String date) {
        Database.newUser(username, password, date);
    }
}
