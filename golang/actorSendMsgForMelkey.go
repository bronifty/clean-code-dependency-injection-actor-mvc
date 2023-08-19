package main
import (
	"fmt"
	"time"
)
type Message struct {
	Content string
}
type SendMessage interface {
	getPayload() string
}
type MessageSenderActor struct {
	name string
	inbox  chan Message
}
func MessageSenderActorFactory(name string) *MessageSenderActor {
	return &MessageSenderActor{
		name: name,
		inbox:   make(chan Message),
	}
}
// when actor1.run() is called, it loops over actor1's inbox array (channel) and prints out actor1 received message msg.content
func (a *MessageSenderActor) run() {
	for msg := range a.inbox{
		fmt.Printf("%s received message: %s\n", a.name, msg.Content)
	}
}
func (a *MessageSenderActor) SendToActor(content string, to *MessageSenderActor) {
	to.inbox<- Message{Content: content}
}
func main() {
	fmt.Printf("creating actor 1 \n")
	actor1 := MessageSenderActorFactory("Actor1")
	fmt.Printf("running actor 1 \n")
	go actor1.run() // actor1 run goroutine is a process listening for messages in the main function (a loop that processes incoming messages); would be an infinite loop if main never shut down
	fmt.Printf("creating actor 2 \n")
	actor2 := MessageSenderActorFactory("Actor2")
	fmt.Printf("running actor 2 \n")
	go actor2.run()
	fmt.Printf("actor 1 sending message hello to actor 2 \n")
	actor1.SendToActor("hello", actor2)
	fmt.Printf("actor 2 sending message goodbye to actor 1 \n")
	actor2.SendToActor("goodbye", actor1)
	fmt.Printf("sleeping for 1 second \n")
	time.Sleep(time.Second)
}
