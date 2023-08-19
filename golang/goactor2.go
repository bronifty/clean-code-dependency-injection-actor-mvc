package main
import (
	"fmt"
	"time"
)
type SendMessage struct {
	Content string
}
type CounterActor struct {
	name string
	inbox  chan SendMessage
}
func CounterActorFactory(name string) *CounterActor {
	return &CounterActor{
		name: name,
		inbox:   make(chan SendMessage),
	}
}
// when actor1.run() is called, it loops over actor1's inbox array (channel) and prints out actor1 received message msg.content
func (a *CounterActor) run() {
	for msg := range a.inbox{
		fmt.Printf("%s received message: %s\n", a.name, msg.Content)
	}
}
func (a *CounterActor) SendToActor(content string, to *CounterActor) {
	to.inbox<- SendMessage{Content: content}
}
func main() {
	fmt.Printf("creating actor 1 \n")
	actor1 := CounterActorFactory("Actor1")
	fmt.Printf("running actor 1 \n")
	go actor1.run() // actor1 run goroutine is a process listening for messages in the main function (a loop that processes incoming messages); would be an infinite loop if main never shut down
	fmt.Printf("creating actor 2 \n")
	actor2 := CounterActorFactory("Actor2")
	fmt.Printf("running actor 2 \n")
	go actor2.run()
	fmt.Printf("actor 1 sending message hello to actor 2 \n")
	actor1.SendToActor("hello", actor2)
	fmt.Printf("actor 2 sending message goodbye to actor 1 \n")
	actor2.SendToActor("goodbye", actor1)
	fmt.Printf("sleeping for 1 second \n")
	time.Sleep(time.Second)
}
