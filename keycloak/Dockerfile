#
# Build stage
#
FROM maven:3.6.0-jdk-11-slim AS build
COPY src /home/app/src
COPY pom.xml /home/app
COPY realm.json /tmp/realm.json
RUN mvn -f /home/app/pom.xml clean package

#
# Package stage
#
FROM quay.io/keycloak/keycloak:13.0.0

COPY --from=build /home/app/target/PrivacyIDEA-Provider.jar /opt/jboss/keycloak/standalone/deployments/demo.jar
COPY --from=build /home/app/src/main/resources/theme-resources/templates/privacyIDEA.ftl /opt/jboss/keycloak/themes/base/login/
COPY --from=build /tmp/realm.json /tmp/realm.json

ENV KEYCLOAK_USER admin
ENV KEYCLOAK_PASSWORD admin

ENV DB_VENDOR h2

ENV KEYCLOAK_IMPORT /tmp/realm.json

EXPOSE 8080

