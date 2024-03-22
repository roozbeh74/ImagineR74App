# imagine_app_r95 app

This app was bootstrapped with [Imagine.ai](https://imagine.ai) 💛

> Imagine.ai is an app starter on steroids!

### Run the app in terminal

Install packages and start the application server.

```
$ yarn install
$ yarn start
```

```

5. Build the application

```

$ yarn build

```

6. Generate and apply migrations

```

$ yarn typeorm migration:generate --config .dev.env -n database-migrations
$ yarn build
$ yarn typeorm migration:run --config .dev.env

```


### Run the app inside a Docker container

Build the docker container and get it up and running.

```

$ docker-compose build
$ docker-compose up

```

### Run migrations inside a Docker container

With docker-compose running, in another terminal:

```

$ docker exec -it docker_name /bin/sh
$ yarn typeorm migration:generate -n migration_name --config .prod.env
$ yarn build
$ yarn typeorm migration:run --config .prod.env

```

### Make API calls against the server

1. Go to [http://localhost:8000/swagger](http://localhost:8000/swagger) to see Swagger documentation for API endpoints.
2. Run the APIs by clicking the "Try it now" button on the Swagger page.

### Run admin bro dashboard

Go to [http://localhost:8000/admin](http://localhost:8000/admin)

### Run tests and check code coverage

```

$ yarn test
$ yarn coverage

```

### Lint your code

```

$ yarn lint
$ yarn format

```

### Learn More

1. Learn more about:
  - the [Node architecture choices](https://imagine.ai/docs/architecture-node) used.
  - the [best practices](https://imagine.ai/docs/best-practices) followed.

2. Imagine is in beta - here are the [known issues](https://imagine.ai/docs/known_issues) that we are working to fix.
```
