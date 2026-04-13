FROM eclipse-temurin:21-jdk AS builder

WORKDIR /build
COPY . .

RUN chmod +x mvnw && ./mvnw clean package -DskipTests


FROM eclipse-temurin:21-jre

WORKDIR /app

RUN mkdir -p /app/config

COPY --from=builder /build/target/*.jar app.jar
COPY src/main/resources/application-prod.properties /app/config/application-prod.properties

ENV SPRING_CONFIG_LOCATION=/app/config/application-prod.properties
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java","-jar","app.jar"]