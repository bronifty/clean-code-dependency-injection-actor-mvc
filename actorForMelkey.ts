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
      try {
        existingContent = await Deno.readTextFile(this.filePath);
      } catch (err) {}
      const newContent = existingContent + message + "\n";
      await Deno.writeTextFile(this.filePath, newContent);
    } catch (err) {
      console.error("An error occurred while writing to the file:", err);
    }
  }
}
type Message = {
  type: string;
  payload: string;
};
interface ActorInterface {
  send(message: Message): void;
}
class Actor implements ActorInterface {
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
class LoggingFactory {
  static createConsoleLogger(): LoggingStrategy {
    return new ConsoleLoggingStrategy();
  }
  static createFileLogger(filePath: string): LoggingStrategy {
    return new FileLoggingStrategy(filePath);
  }
}
class ActorFactory {
  static createLoggingActor(loggingStrategy: LoggingStrategy): ActorInterface {
    const loggingHandler = (message: Message) => {
      if (message.type === "log") {
        loggingStrategy.log(message.payload);
      }
    };
    return new Actor(loggingHandler);
  }
}
async function main() {
  const consoleLoggingStrategy = LoggingFactory.createConsoleLogger();
  const consoleLoggingActor = ActorFactory.createLoggingActor(
    consoleLoggingStrategy
  );
  consoleLoggingActor.send({ type: "log", payload: "Logging to console." });
  const logFilePath = "./logs.txt";
  const fileLoggingStrategy = LoggingFactory.createFileLogger(logFilePath);
  const fileLoggingActor = ActorFactory.createLoggingActor(fileLoggingStrategy);
  fileLoggingActor.send({ type: "log", payload: "Logging to file." });
  await new Promise((resolve) => setTimeout(resolve, 100));
  try {
    const content = Deno.readTextFileSync(logFilePath);
    console.log(`Content of the log file: ${content}`);
  } catch (err) {
    console.error("An error occurred while reading the log file:", err);
  }
}
main();
