# Build stage
FROM maven:3.8.4-openjdk-8 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:8-jre-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the packaged WAR file from build stage
COPY --from=build /app/target/SignlensBackend-0.0.1-SNAPSHOT.war /app/app.war

# Expose the port that the application will run on
EXPOSE 8885

# Run the application when the container launches
CMD ["java", "-jar", "app.war"]