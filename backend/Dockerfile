FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN groupadd --system abeia && useradd --system --gid abeia abeia
COPY --from=build /app/target/backend-abeia-1.0.0.jar app.jar
USER abeia
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=65 -XX:+ExitOnOutOfMemoryError"
EXPOSE 8088
CMD ["java", "-jar", "app.jar"]
