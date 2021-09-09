// child class of account for verifying a user
// https://www.quickprogrammingtips.com/java/how-to-securely-store-passwords-in-java.html

import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class Authentication  {
    Authentication() {
    }

    public static boolean authenticateUser(String inputUser, String inputPass) throws Exception {
        UserInfo user = Database.checkUser(inputUser);
        if (user == null) {
            return false;
        } else {
            String salt = user.userSalt;
            String calculatedHash = getEncryptedPassword(inputPass, salt);
            return calculatedHash.equals(user.userEncryptedPassword);
        }
    }

    public static void signUp(String userName, String password) throws Exception {
        String salt = getNewSalt();
        String encryptedPassword = getEncryptedPassword(password, salt);
        UserInfo user = new UserInfo();
        user.userEncryptedPassword = encryptedPassword;
        user.userName = userName;
        user.userSalt = salt;
        saveUser(user);
    }

    // Get an encrypted password using PBKDF2 hash algorithm
    private static String getEncryptedPassword(String password, String salt) throws Exception {
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
    private static String getNewSalt() throws Exception {
        // Don't use Random!
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        // NIST recommends minimum 4 bytes.
        byte[] salt = new byte[8];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private static void saveUser(UserInfo user) {
        String date = new Date().toString();
        Database.addUser(user.userName, user.userEncryptedPassword, user.userSalt, date);
    }

}

// Each user has a unique salt
// This salt must be recomputed during password change!
class UserInfo {
    String userEncryptedPassword;
    String userSalt;
    String userName;
}
