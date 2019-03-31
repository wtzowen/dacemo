### Local Build Instructions
Requires:
* At least Maven 2
* Tomcat 7
* StarDog 6.x.x

First-time Instructions:
* For installling Stardog (our triplestore/database), instruction are found [here](https://www.stardog.com/docs/#_quick_start_guide).
* Once Stardog has been installed, we start the database server by going to `$STARDOG_INSTALL/bin/` and executing `stardog-admin server start` (Windows) / `./stardog-admin server start` (Mac/Linux). 
* Since this is a first-time setup, we must add the databases we are working on, by executing `stardog-admin db create -n iteration0 $PROJECT_LOCATION/owl/iteration-0.ttl` (Windows) / `./stardog-admin db create -n iteration0 $PROJECT_LOCATION/owl/iteration-0.ttl` (Mac/Linux).
* When finished, don't forget to execute `stardog-admin server stop`(Windows)/`./stardog-admin server stop`(Mac/Linux).

* Once Tomcat is installed, add the following to `$TOMCAT_INSTALL/conf/tomcat-users.xml` file, inside the `<tomcat-users>...</tomcat-users>` tag:
```  
<role rolename="manager-script"/>
<user username="admin" password="admin" roles="manager-script" />
``` 

Running it all other times:
* In `$STARDOG_INSTALL/bin/` execute `stardog-admin server start`(Windows)/`./stardog-admin server start`(Mac/Linux).
* In `$TOMCAT_INSTALL/bin/` execute `startup.bat`(Windows)/`./startup`(Mac/Linux).
* In `$PROJECT_LOCATION` execute `mvn tomcat7:deploy`.
* In a web browser, navigate to `http://localhost:8080/DaCeMo_war_exploded`. 
* Once finished, don't forget to execute `shutdown.bat`/`./shutdown` in `$TOMCAT_INSTALL/bin/`, and `stardog-admin server stop`/`./stardog-admin server stop` in `$STARDOG_INSTALL/bin/` to close the server and triplestore server gracefully. 

# DaCeMo Visualisation - Landing Page
A website that displays a navigable, query-able, and understandable graph representation of a Data-Centric Model (DaCeMo) of an Enterprise.

A complex domain made understandable to enterprise users from middle management, to IT, to CEOs, through varying layers of data abstraction. 

DaCeMo is an approach to modelling Enterprise as a set of OWL (Web Ontology Language) Ontologies. 

## CLIENT VISION
Present Data-Centric, Ontology-based, integrated, qualitative models of enterprise in a way that can be understood and navigated by untrained enterprise users. The model will contain:

* Explicitly modelled
  - Business Motivations
  - Business Processes
  - Business Capabilities
* Imported IT data
* Imported personnel data
* Imported Requirements, User Stories


## TEAM
Name | Role(s) 
--- | ---
Tommy Gatti - u6044453 | Project Manager, Backend/Triples Engineer
Min Liu - u6339307 | Supporting Project Manager, Backend/Business Logic Programmer
Lifu Zhao - u6534756 | Backend/Server Build Engineer
Yu Yang - u6412985 | Frontend/Presentation Logic Programmer
Wenrui Li - u6361099 | Frontend/D3.js Specialist
Taizhou Wang - u6273306 | Frontend/JS build & lifecycle


## PROJECT ARTEFACTS
* Group Meeting Notes (https://drive.google.com/drive/folders/1_aV8nk1iTIEDQqXfpiLfJIt98wacqaNN)
* Tutorial Meeting Notes (https://drive.google.com/drive/folders/1EVf0rtFta_mMU0YTYTKv01-1qXnByU2B)
* Client Meeting Notes (https://drive.google.com/drive/folders/1itF2R-CSuwl4ndsbM9IxND6fQgra1L-S)


## DELIVERING VALUE
### For Client
* Exploratory research into different ontology and graph presentation formats.
* Develop user-friendly, presentable Data Centric Modelling graphs. 
* A domain in which the information gathered by the modeller is traditionally explained to the end user in subsets (or not at all) is now clearly understandable to an untrained user. 
* With graphs that integrate Business and Technical knowledge, the Business/IT misalignment in traditional enterprise is narrowed. 

## TECHNICAL ARTEFACTS

## ROLES AND ACTIVITIES

## DECISION MAKING PROCESS
Decision making log: (https://drive.google.com/drive/folders/1m4mbyVoh4ibqYACCxjURbvI8BEEMAGKK)

## FEEDBACK FROM CLIENT/TUTOR
Feedback folder: (https://drive.google.com/drive/folders/18DwHCNWPbn7vS9Wgz2ojq_kGW4YRXe8o)

## TEAM WORK
The team members are divided into two subteams to work on frontend and backend. 
However, these subteams will communicate regularly, as the format of data passed between these layers may change. 

## PROJECT SCHEDULE
### Iterations
* Iteration Zero
  * Build Tomcat server.
  * Website contains landing page, graph view page, can present Top-Level Concepts graphically.
* Iteration One
  * Build graphs of Top-Level Concepts (Nodes and Edges from Top Level Concepts). 

### Timeline
Week | Goal
--- | --- 
3 | Finalize roles, Implement and build server structure  
4 | Frontend must have the landing page, Open graph views
5 | Present top level concepts graphically (Nodes only)(Iteration Zero)
6 | Build graphs of top level concepts (Nodes and Edges from Top Level Concepts)
7 | Make graphs searchable and navigable 

Iterations/Timelines are subject to change. 
 


Signed:
