import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
 
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
 
public class SecurePasswordStorageDemo {
 
    // Simulates database of users!
    private Map<String, UserInfo> userDatabase = new HashMap<String,UserInfo>();
 
    public static void main(String[] args) throws Exception {
        SecurePasswordStorageDemo passManager = new SecurePasswordStorageDemo();
        String userName = "admin";
        String password = "password";
        passManager.signUp(userName, password);
 
        Scanner scanner = new Scanner(System.in);
        System.out.println("Please enter username:");
        String inputUser = scanner.nextLine();
 
        System.out.println("Please enter password:");
        String inputPass = scanner.nextLine();
 
        boolean status = passManager.authenticateUser(inputUser, inputPass);
        if (status) {
            System.out.println("Logged in!");
        } else {
            System.out.println("Sorry, wrong username/password");
        }
        scanner.close();
    }
 
    private boolean authenticateUser(String inputUser, String inputPass) throws Exception {
        UserInfo user = userDatabase.get(inputUser);
        if (user == null) {
            return false;
        } else {
            String salt = user.userSalt;
            String calculatedHash = getEncryptedPassword(inputPass, salt);
            if (calculatedHash.equals(user.userEncryptedPassword)) {
                return true;
            } else {
                return false;
            }
        }
    }
 
    private void signUp(String userName, String password) throws Exception {
        String salt = getNewSalt();
        String encryptedPassword = getEncryptedPassword(password, salt);
        UserInfo user = new UserInfo();
        user.userEncryptedPassword = encryptedPassword;
        user.userName = userName;
        user.userSalt = salt;
        saveUser(user);
    }
 
    // Get a encrypted password using PBKDF2 hash algorithm
    public String getEncryptedPassword(String password, String salt) throws Exception {
        String algorithm = "PBKDF2WithHmacSHA1";
        int derivedKeyLength = 160; // for SHA1
        int iterations = 20000; // NIST specifies 10000
 
        byte[] saltBytes = Base64.getDecoder().decode(salt);
        KeySpec spec = new PBEKeySpec(password.toCharArray(), saltBytes, iterations, derivedKeyLength);
        SecretKeyFactory f = SecretKeyFactory.getInstance(algorithm);
 
        byte[] encBytes = f.generateSecret(spec).getEncoded();
        return Base64.getEncoder().encodeToString(encBytes);
    }
 
    // Returns base64 encoded salt
    public String getNewSalt() throws Exception {
        // Don't use Random!
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        // NIST recommends minimum 4 bytes. We use 8.
        byte[] salt = new byte[8];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
 
    private void saveUser(UserInfo user) {
        userDatabase.put(user.userName, user);
    }
 
}
 
// Each user has a unique salt
// This salt must be recomputed during password change!
class UserInfo {
    String userEncryptedPassword;
    String userSalt;
    String userName;
}