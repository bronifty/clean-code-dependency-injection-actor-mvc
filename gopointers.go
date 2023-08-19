type MyStruct struct {
	Value int
}

func NewMyStruct() *MyStruct {
	s := MyStruct{Value: 42} // Local variable, could be on stack
	return &s                // Return address of s; Go ensures it's valid, could be on heap
}

func main() {
	p := NewMyStruct() // p is a pointer to a MyStruct
	fmt.Println((*p).Value) // Dereference p to access Value field; prints 42
}
// * is a pointer in a type declaration, a value of a pointer in an expression; & is the address of a pointer's reference in memory

go actor1.run() // actor1 run goroutine is a process listening for messages in the main function (a loop that processes incoming messages); would be an infinite loop if main never shut down

// when actor1.run() is called, it loops over actor1's inbox array (channel) and prints out actor1 received message msg.content, correct?
func (a *CounterActor) run() {
	for msg := range a.ch {
		fmt.Printf("%s received message: %s\n", a.name, msg.Content)
	}
}