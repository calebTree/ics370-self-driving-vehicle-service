// main account class for holding a user's information

import java.util.Date;

public class Account {
    private final String username, password;
    private final Database login = new Database();

    Account(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public void authentication() {
        login.checkUser(username, password);
    }

    public void newUser() {
        String date = new Date().toString();
        login.addUser(username, password, date);
    }

}
