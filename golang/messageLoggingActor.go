package main
import (
	"fmt"
	"io/ioutil"
	"os"
	"time"
)
type Message struct {
	Content string
}
type ConsoleMessage struct {
	Message
}
type FileMessage struct {
	Message
	filePath string
}
type LogMessage interface {
	log()
}
type LogMessageActor struct {
	name  string
	inbox chan LogMessage
}
func (c ConsoleMessage) log() {
	fmt.Println(c.Content)
}
func (f FileMessage) log() {
	existingContent, err := ioutil.ReadFile(f.filePath)
	if err != nil && !os.IsNotExist(err) {
		fmt.Println("An error occurred while reading the file:", err)
		return
	}
	newContent := string(existingContent) + f.Content + "\n"
	err = ioutil.WriteFile(f.filePath, []byte(newContent), os.ModePerm)
	if err != nil {
		fmt.Println("An error occurred while writing to the file:", err)
	}
}
func LogMessageActorFactory(name string) *LogMessageActor {
	return &LogMessageActor{
		name:  name,
		inbox: make(chan LogMessage),
	}
}
func (a *LogMessageActor) run() {
	for msg := range a.inbox {
		msg.log()
	}
}
func (a *LogMessageActor) logMessage(message LogMessage) {
	a.inbox <- message
}
func main() {
	logFilePath := "./logs.txt"
	actor := LogMessageActorFactory("LogActor")
	go actor.run()
	actor.logMessage(ConsoleMessage{Message{Content: "Logging to console."}})
	actor.logMessage(FileMessage{Message: Message{Content: "Logging to file."}, filePath: logFilePath})
	time.Sleep(time.Second)
	content, err := ioutil.ReadFile(logFilePath)
	if err != nil {
		fmt.Println("An error occurred while reading the log file:", err)
		return
	}
	fmt.Println("Content of the log file:", string(content))
}
