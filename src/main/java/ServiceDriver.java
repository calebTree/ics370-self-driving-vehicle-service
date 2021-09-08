// main driver of program

import java.util.Scanner;
import java.util.Date;

public class ServiceDriver {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String choice;              // main interface choice
        String username;            // account username input
        String password;            // account password

        for (;;) {
            System.out.println("\nWelcome to a self-driving-vehicle reservation or hailing service!");
            System.out.println("Please login or create an account.\n");
            System.out.print("(L) Login, (C) Create account, (Q) Quit: ");
            choice = input.nextLine();
            choice = choice.toLowerCase();
            char ch = choice.charAt(0);
            switch (ch) {
                case 'l' -> {
                    System.out.print("Please enter your username: ");
                    username = input.nextLine();
                    System.out.print("Please enter your password: ");
                    password = input.nextLine();
                    Account login = new Account(username, password);
                    login.authentication();
                }
                case 'c' -> {
                    System.out.print("Please choose a username: ");
                    username = input.nextLine();
                    System.out.print("Please choose a password: ");
                    password = input.nextLine();
                    Account user = new Account(username, password);
                    user.newUser();
                }
                case 'q' -> {
                    System.out.println("Goodbye!");
                    System.exit(0);
                }
                default -> System.out.println("Invalid option.");
            }
        }

//        GeoLocation location = new GeoLocation();
//        System.out.println(location.getLatLon());
//        System.out.println("Listing users in database:");
//        initializeDB();
    }


}
