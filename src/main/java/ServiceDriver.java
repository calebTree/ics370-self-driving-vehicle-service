// main driver of program

import java.sql.SQLException;
import java.util.Scanner;
import java.io.Console;

//jfx
import javafx.application.Application;
import javafx.geometry.Pos;
//import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
//import javafx.scene.text.Font;
//import javafx.scene.text.Text;
import javafx.stage.Stage;

public class ServiceDriver extends Application {
    public void start(Stage primaryStage) {
        //create a clock and a lable
        ClockPane clock = new ClockPane();
        String timeString = clock.getHour() + ":" + clock.getMinute() + ":" + clock.getSecond();
        Label lblCurrentTime = new Label(timeString);

        //place clock in lable in border pane
        BorderPane pane = new BorderPane();
        pane.setCenter(clock);
        pane.setBottom(lblCurrentTime);
        BorderPane.setAlignment(lblCurrentTime, Pos.TOP_CENTER);

        //create a scene and place it in the stage
        Scene scene = new Scene(pane, 250, 250);
        primaryStage.setTitle("DisplayClock"); //set the stage title
        primaryStage.setScene(scene);//place the scene in the stage
        primaryStage.show(); //display the stage
    }

    public static void main(String[] args) {
        // password mask input
        Console c = System.console();
        Scanner input = new Scanner(System.in);

        // interface
        String choice;
        char ch;
        // account password
        char[] pass;
        String password;
        // account username input
        String username;

        System.out.println("\nWelcome to a self-driving-vehicle reservation or hailing service!");

        for (;;) {
            System.out.println("Please login or create an account.\n");
            System.out.print("(L) Login, (C) Create account, (Q) Quit: ");
            // main interface choice
            choice = input.nextLine();
            choice = choice.toLowerCase();
            ch = choice.charAt(0);

            switch (ch) {
                case 'l' -> {
                    System.out.print("Please enter your username: ");
                    username = input.nextLine();
                    if (c == null) {
                        System.out.print("Please enter your password: ");
                        password = input.nextLine();
                        try {
                            boolean status = Authentication.authenticateUser(username, password);
                            if (status) {
                                System.out.println("\nLogged in!");
                                try {
                                    GeoLocation location = new GeoLocation();
                                    System.out.println("Your city is: " + location.getCity());
                                    System.out.println(location.getLatLon());
                                    Application.launch();
                                } catch (Exception ex) {
                                    System.out.println("\nError finding location:" + ex.getMessage());
                                }
                            } else {
                                System.out.println("\nSorry, wrong username/password.");
                            }
                        } catch (SQLException ex) {
                            System.out.println("\nSQL Error: " + ex.getMessage());
                        } catch (Exception ex) {
                            System.out.println("\nError with crypto: " + ex.getMessage());
                        }
                    } else {
                        pass = c.readPassword("Please enter your password: ");
                        password = String.valueOf(pass);
                        try {
                            boolean status = Authentication.authenticateUser(username, password);
                            if (status) {
                                System.out.println("\nLogged in!");
                                try {
                                    GeoLocation location = new GeoLocation();
                                    System.out.println("Your city is: " + location.getCity());
                                    System.out.println(location.getLatLon());
                                } catch (Exception ex) {
                                    System.out.println("\nError finding location:" + ex.getMessage());
                                }
                            } else {
                                System.out.println("\nSorry, wrong username/password.");
                            }
                        } catch (SQLException ex) {
                            System.out.println("\nSQL Error: " + ex.getMessage());
                        } catch (Exception ex) {
                            System.out.println("\nError with crypto: " + ex.getMessage());
                        }
                    }
                }
                case 'c' -> {
                    System.out.print("Please choose a username: ");
                    username = input.nextLine();
                    System.out.print("Please choose a password: ");
                    password = input.nextLine();
                    try {
                        Authentication.signUp(username, password);
                    } catch (SQLException ex) {
                        System.out.println("\nSQL Error: " + ex.getMessage());
                    } catch (Exception ex) {
                        System.out.println("\nError with crypto: " + ex.getMessage());
                    }
                }
                case 'q' -> {
                    System.out.println("Goodbye!");
                    System.exit(0);
                }
                default -> System.out.println("Invalid option.");
            }
        }
    }
}
