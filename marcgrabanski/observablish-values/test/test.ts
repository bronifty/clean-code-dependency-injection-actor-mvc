import { assertEquals } from "https://deno.land/std@0.199.0/testing/asserts.ts";
import { ObservableFactory } from "../observable.ts";

// Publish changes to subscriber functions when values change.
// Modifying arrays and objects will not publish, but replacing them will.
// Passing a function caches the result as the value. Any extra arguments will be passed to the function.
// Any observables called within the function will be subscribed to, and updates to those observables will recompute the value.
// Child observables must be called, mere references are ignored.
// If the function returns a Promise, the value is assigned async after resolution.

// Requirement 1
Deno.test("ObservableValue publish and subscribe", () => {
  const observable = new ObservableValue<number>();
  let lastValue: number | null = null;
  observable.subscribe((current) => {
    lastValue = current;
  });
  observable.accessor(42);
  assertEquals(lastValue, 42);
});

// Requirement 2
Deno.test(
  "ObservableValue publish on array replacement, not modification",
  () => {
    const observable = new ObservableValue<number[]>();
    let count = 0;
    observable.subscribe(() => count++);
    const arr = [1, 2];
    observable.accessor(arr); // Trigger once
    arr.push(3); // Should not trigger
    observable.accessor([1, 2, 3]); // Trigger again
    assertEquals(count, 2);
  }
);

// Requirement 3
Deno.test(
  "ObservableValue accessor sets value with a function and arguments",
  () => {
    const observable = new ObservableValue<number>();
    const func = (a: number, b: number) => a + b;
    observable.accessor(func, 3, 4);
    assertEquals(observable.accessor(), 7);
  }
);

Deno.test(
  "ObservableValue recomputes value when child observables change",
  async () => {
    const childObservable = new ObservableValue<number>();
    childObservable.accessor(5);

    const parentObservable = new ObservableValue<number>();
    const func = () => (childObservable.accessor() ?? 0) * 2;
    parentObservable.accessor(func);

    assertEquals(parentObservable.accessor(), 10);

    // Change the value of the child observable
    childObservable.accessor(10);

    // Wait for recomputation
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Check that the parent observable has recomputed its value based on the child observable's change
    assertEquals(parentObservable.accessor(), 20);
  }
);

// Requirement 6
Deno.test("ObservableValue compute with async function", async () => {
  const observable = new ObservableValue<number>();
  const func = async () => {
    return 42;
  };
  observable.accessor(func);
  await observable.compute(); // Wait for async resolution
  assertEquals(observable.accessor(), 42);
});
