class ActorFactory {
  static createLoggingActor(loggingStrategy: LoggingStrategy): Actor {
    const loggingHandler = (message: Message) => {
      if (message.type === "log") {
        loggingStrategy.log(message.payload);
      }
    };
    return new Actor(loggingHandler);
  }
}
class LoggingFactory {
  static createConsoleLogger(): LoggingStrategy {
    return new ConsoleLoggingStrategy();
  }
  static createFileLogger(filePath: string): LoggingStrategy {
    return new FileLoggingStrategy(filePath);
  }
}
