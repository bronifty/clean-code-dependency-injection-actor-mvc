const consoleLoggingStrategy = LoggingFactory.createConsoleLogger();
const consoleLoggingActor = ActorFactory.createLoggingActor(
  consoleLoggingStrategy
);
consoleLoggingActor.send({ type: "log", payload: "Logging to console." });

const fileLoggingStrategy = LoggingFactory.createFileLogger("./logs.txt");
const fileLoggingActor = ActorFactory.createLoggingActor(fileLoggingStrategy);
fileLoggingActor.send({ type: "log", payload: "Logging to file." });
