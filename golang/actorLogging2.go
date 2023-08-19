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
type LogMessage struct {
	Message
}
type ConsoleMessage struct {
	Message
}
type MessageSenderActor struct {
	name   string
	inbox  chan SendMessage
	handler func(message SendMessage)
}
type FileLoggingStrategy struct {
	filePath string
}
type ConsoleLoggingStrategy struct{}
type LoggingStrategy interface {
	log(message string)
}
type SendMessage interface {
	getPayload() string
}
func (c ConsoleMessage) getPayload() string {
	return c.Content
}
func (l LogMessage) getPayload() string {
	return l.Content
}

func (c *ConsoleLoggingStrategy) log(message string) {
	fmt.Println(message)
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

func MessageSenderActorFactory(name string, loggingStrategy LoggingStrategy) *MessageSenderActor {
	loggingHandler := func(message SendMessage) {
		loggingStrategy.log(message.getPayload())
	}
	return &MessageSenderActor{
		name:    name,
		inbox:   make(chan SendMessage),
		handler: loggingHandler,
	}
}
func (a *MessageSenderActor) run() {
	for msg := range a.inbox {
		a.handler(msg)
	}
}
func (a *MessageSenderActor) SendToActor(content string, messageType string, to *MessageSenderActor) {
	var msg SendMessage
	if messageType == "console" {
		msg = ConsoleMessage{Message{Content: content}}
	} else {
		msg = LogMessage{Message{Content: content}}
	}
	to.inbox <- msg
}
func main() {
	logFilePath := "./logs.txt"
	consoleLoggingStrategy := &ConsoleLoggingStrategy{}
	consoleLoggingActor := MessageSenderActorFactory("ConsoleActor", consoleLoggingStrategy)
	go consoleLoggingActor.run()
	fileLoggingStrategy := &FileLoggingStrategy{filePath: logFilePath}
	fileLoggingActor := MessageSenderActorFactory("FileActor", fileLoggingStrategy)
	go fileLoggingActor.run()
	consoleLoggingActor.SendToActor("Logging to console.", "console", fileLoggingActor)
	fileLoggingActor.SendToActor("Logging to file.", "log", consoleLoggingActor)
	time.Sleep(time.Second)
	content, err := ioutil.ReadFile(logFilePath)
	if err != nil {
		fmt.Println("An error occurred while reading the log file:", err)
		return
	}
	fmt.Println("Content of the log file:")
	fmt.Println(string(content))
}
