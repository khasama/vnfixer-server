import { Application } from "./app";

// load the environment variables from the .env file

function bootstrap() {
  const application = new Application();
  application.init();
  application.start();
}

bootstrap();
