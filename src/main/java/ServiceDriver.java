// main driver of program

import java.util.Scanner;

public class ServiceDriver {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        for (;;) {
            System.out.println("\nWelcome to a self-driving-vehicle reservation or hailing service!");
            System.out.println("Please login or create an account.\n");
            System.out.print("(L) Login, (C) Create account, (Q) Quit: ");
            // main interface choice
            String choice = input.nextLine();
            choice = choice.toLowerCase();
            char ch = choice.charAt(0);
            // account username input
            String username;
            // account password
            String password;
            switch (ch) {
                case 'l' -> {
                    System.out.print("Please enter your username: ");
                    username = input.nextLine();
                    System.out.print("Please enter your password: ");
                    password = input.nextLine();
                    boolean status = Authentication.authenticateUser(username, password);
                    if (status) {
                        System.out.println("Logged in!");
                    } else {
                        System.out.println("Sorry, wrong username/password");
                    }
                }
                case 'c' -> {
                    System.out.print("Please choose a username: ");
                    username = input.nextLine();
                    System.out.print("Please choose a password: ");
                    password = input.nextLine();
                    Authentication.signUp(username, password);
                }
                case 'q' -> {
                    System.out.println("Goodbye!");
                    System.exit(0);
                }
                default -> System.out.println("Invalid option.");
            }
        }
//        GeoLocation location = new GeoLocation();
    }
}
