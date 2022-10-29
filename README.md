# HeatMaps

The HeatMaps application is a habit tracker system to help one develop a life of discipline.

Inspired by lifeofdiscipline.com, the goal is to have a similar system without the limitations imposed by their unpayd subscription.

> **This is the repository for the backend-api and database development.**

# Database Design

This is the database for the habits tracker app:

![Entity Relationship Diagram](database/ERD.png "Entity Relationship Diagram")

## Initializing a temporary MySQL instance from the logical backup

Change into the `/databases` directory and build the Docker image:

```sh
docker build . --tag heatmaps
```

Run the database container:

```sh
docker run
  --rm
  -d
  -p 3306:3306
  --name heatmaps-container
  heatmaps
```

# System High Level Architecture 

A simple three tier architecture is proposed to develop the solution.

![Architecture](./architecture.png "Architecture")

# Source Code High Level Architecture

To be able to accommodate a source code base that may grow big as time passes, a layered implementation with well-defined responsibilities should be used:

- *./src/controllers* - delegates the request to the appropriate underlying system.
- *./src/services* - custom business related processing and rules (optional).
- *./src/repositories* - database entities interaction.
- *./src/lib* - shared and reusable code.

The creation and naming of those elements should always attempt to mimic the application Model. The application model is composed by the Entities defined in the system, such as `Users`, `Habits` and `HabitLogs`. For example, we could imagine a user-controller, user-service and user-repository.

