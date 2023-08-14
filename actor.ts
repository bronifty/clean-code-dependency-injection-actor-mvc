class Actor {
  private mailbox: Message[] = [];
  constructor(private handler: (message: Message) => void) {}
  send(message: Message) {
    this.mailbox.push(message);
    this.process();
  }
  private process() {
    while (this.mailbox.length > 0) {
      const message = this.mailbox.shift();
      if (message) {
        this.handler(message);
      }
    }
  }
}
interface LoggingStrategy {
  log(message: string): void;
}
class ConsoleLoggingStrategy implements LoggingStrategy {
  log(message: string) {
    console.log(message);
  }
}
class FileLoggingStrategy implements LoggingStrategy {
  private filePath: string;
  constructor(filePath: string) {
    if (filePath === undefined) {
      throw new Error("File path is undefined");
    }
    this.filePath = filePath;
  }
  async log(message: string) {
    try {
      let existingContent = "";
      const newContent = existingContent + message + "\n";
      await Deno.writeTextFile(this.filePath, message, { append: true });
    } catch (err) {
      console.error("An error occurred while writing to the file:", err);
    }
  }
}
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
const consoleLoggingStrategy = LoggingFactory.createConsoleLogger();
const consoleLoggingActor = ActorFactory.createLoggingActor(
  consoleLoggingStrategy
);
consoleLoggingActor.send({ type: "log", payload: "Logging to console." });
const fileLoggingStrategy = LoggingFactory.createFileLogger("./logs.txt");
const fileLoggingActor = ActorFactory.createLoggingActor(fileLoggingStrategy);
fileLoggingActor.send({ type: "log", payload: "Logging to file." });
