package main
import (
	"fmt"
	"io/ioutil"
	"os"
)
type Message interface {
	getPayload() string
}
type ConsoleMessage struct {
	Payload string
}
type LogMessage struct {
	Payload string
}
type Actor struct {
	mailbox []Message
	handler func(message Message)
}
func (c ConsoleMessage) getPayload() string {
	return c.Payload
}
func (l LogMessage) getPayload() string {
	return l.Payload
}
func (a *Actor) send(message Message) {
	a.mailbox = append(a.mailbox, message)
	a.process()
}
func (a *Actor) process() {
	for len(a.mailbox) > 0 {
		message := a.mailbox[0]
		a.mailbox = a.mailbox[1:]
		a.handler(message)
	}
}
type LoggingStrategy interface {
	log(message string)
}
type ConsoleLoggingStrategy struct{}
func (c *ConsoleLoggingStrategy) log(message string) {
	fmt.Println(message)
}
type FileLoggingStrategy struct {
	filePath string
}
func (f *FileLoggingStrategy) log(message string) {
	existingContent, err := ioutil.ReadFile(f.filePath)
	if err != nil && !os.IsNotExist(err) {
		fmt.Println("An error occurred while reading the file:", err)
		return
	}
	newContent := string(existingContent) + message + "\n"
	err = ioutil.WriteFile(f.filePath, []byte(newContent), os.ModePerm)
	if err != nil {
		fmt.Println("An error occurred while writing to the file:", err)
	}
}
func createLoggingActor(loggingStrategy LoggingStrategy) *Actor {
	loggingHandler := func(message Message) {
		loggingStrategy.log(message.getPayload())
	}
	return &Actor{handler: loggingHandler}
}
func main() {
	logFilePath := "./logs.txt"
	consoleLoggingStrategy := &ConsoleLoggingStrategy{}
	consoleLoggingActor := createLoggingActor(consoleLoggingStrategy)
	consoleLoggingActor.send(ConsoleMessage{Payload: "Logging to console."})
	fileLoggingStrategy := &FileLoggingStrategy{filePath: logFilePath}
	fileLoggingActor := createLoggingActor(fileLoggingStrategy)
	fileLoggingActor.send(LogMessage{Payload: "Logging to file."})
	content, err := ioutil.ReadFile(logFilePath)
	if err != nil {
		fmt.Println("An error occurred while reading the log file:", err)
		return
	}
	fmt.Println("Content of the log file:")
	fmt.Println(string(content))
}
