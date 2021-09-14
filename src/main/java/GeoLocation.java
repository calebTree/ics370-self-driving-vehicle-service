// parse location JSON from web

import org.json.JSONObject;

import java.io.IOException;
import java.net.*;
import java.net.http.*;

public class GeoLocation {
    private final HttpResponse<String> response;

    public GeoLocation() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create("https://freegeoip.app/json/")).build();
        response = client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    public String getLatLon() {
        JSONObject jsonO = new JSONObject(response.body());
        double lat = jsonO.getDouble("latitude");
        double lon = jsonO.getDouble("longitude");
        return "Latitude: " + lat + "\nLongitude: " + lon;
    }

    public String getCity() {
        JSONObject jsonO = new JSONObject(response.body());
        return jsonO.getString("city");
    }

}
