import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.stardog.stark.IRI;
import com.stardog.stark.query.BindingSet;
import stardog.StardogTriplesDBConnection;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;

public class ServerContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        StardogTriplesDBConnection connection = new StardogTriplesDBConnection("magic", "http://localhost:5820", "admin", "admin");
        if (!connection.canConnect()){
            System.out.println("Cannot connect to the database. ");
            // TODO: 17/03/2019 send this result to the frontend?
        } else {
            ArrayList<IRI> result = connection.selectQuery(
                    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
                    "SELECT ?s WHERE {" +
                    "    ?s rdfs:subClassOf <http://www.dacemo.org/dacemo/Person> " +
                    "}"
            );
            // TODO: 21/03/2019 Convert 'result' to a suitable format (JSON) and send to frontend, rather than just printing it to console.
            System.out.println(result);

            ArrayList<Node> nodes = new ArrayList<>();
            Gson json = new Gson();
            for (IRI obj: result){
                Node node = new Node(obj.localName(), 1);
                nodes.add(node);
            }
            D3Object d3Object = new D3Object(nodes);    // Translate result into JSON format
            String reponse = json.toJson(d3Object);

            try (FileWriter writer = new FileWriter("D3.json")) {   // Save JSON file
                writer.write(reponse);
                writer.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    /**
     * The server is about to be shut down, run this code.
     * @param servletContextEvent the event that caused the shutdown.
     */
    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {}
}
