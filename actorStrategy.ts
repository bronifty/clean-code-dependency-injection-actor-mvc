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
