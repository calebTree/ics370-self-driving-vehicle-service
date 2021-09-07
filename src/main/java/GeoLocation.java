
//import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.*;
import java.net.http.*;

public class GeoLocation {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder().uri(URI.create("https://freegeoip.app/json/")).build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

    GeoLocation() throws IOException, InterruptedException {

    }

    public String getLatLon() {
        return parseLatLon(response.body());
    }

    public String getCity() {
        return parseCity(response.body());
    }

    public static String parseLatLon(String responseBody) {
        JSONObject jsonO = new JSONObject(responseBody);
        double lat = jsonO.getDouble("latitude");
        double lon = jsonO.getDouble("longitude");

        return "Latitude: " + lat + "\nLongitude: " + lon;
    }

    public static String parseCity(String responseBody) {
        JSONObject jsonO = new JSONObject(responseBody);
        String cName = jsonO.getString("country_name");

        return "City: " + cName + ".";
    }

}
