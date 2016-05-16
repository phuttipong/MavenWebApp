REST application boilerplate
================

Based on Spring 4

### Tomcat Server configuration steps
1. by default Add new 'Local' Tomcat configuration
2. specific "-Dlog4j.configuration=log4j-dev.xml" in VM options
3. add Run Maven Goal 'clean' before Make.

### Test Environments
After build UI project then copy build files to folder src/main/resources/uiDevAsset/. Run or debug Dev(Tomcat Server) configuration.
Then go to http://localhost:8080/static/index.html

