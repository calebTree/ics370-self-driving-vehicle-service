
//import org.json.JSONArray;
import org.json.JSONObject;

import java.net.*;
import java.net.http.*;

public class GeoLocationExample {
    public static void main(String args[]) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create("https://freegeoip.app/json/")).build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(GeoLocationExample::parse)
                .join();
    }

    public static String parse(String responseBody) {
        JSONObject geoL = new JSONObject(responseBody);
            String ip = geoL.getString("ip");
            String cCode = geoL.getString("country_code");
            String cName = geoL.getString("country_name");
            String rCode = geoL.getString("region_code");
            String rName = geoL.getString("region_name");
            String city = geoL.getString("city");
            int zip = geoL.getInt("zip_code");
            String tz = geoL.getString("time_zone");
            double lat = geoL.getDouble("latitude");
            double lon = geoL.getDouble("longitude");
            int metroC = geoL.getInt("metro_code");

            System.out.println("Latitude: " + lat + "\nLongitude: " + lon);

        return null;
    }

}
