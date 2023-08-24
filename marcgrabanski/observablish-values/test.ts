import { assertEquals } from "https://deno.land/std@0.199.0/testing/asserts.ts";
import { ObservableFactory } from "./observable.ts";

// Publish changes to subscriber functions when values change.
// Modifying arrays and objects will not publish, but replacing them will.
// Passing a function caches the result as the value. Any extra arguments will be passed to the function.
// Any observables called within the function will be subscribed to, and updates to those observables will recompute the value.
// Child observables must be called, mere references are ignored.
// If the function returns a Promise, the value is assigned async after resolution.

// Requirement 1
Deno.test("Observable publish and subscribe", () => {
  // observable is effectively a signal or a stream of values/events that other values can react to
  const observable = ObservableFactory.create(42);
  // trackedVal is a variable that will be updated when the observable is updated
  let trackedVal: number | null = null;
  observable.subscribe((current: number) => {
    trackedVal = current;
  });
  observable.value = 42;
  assertEquals(trackedVal, 42);
  observable.value = 43;
  assertEquals(trackedVal, 43);
});

// Requirement 2
Deno.test("Observable publish on array replacement, not modification", () => {
  const observable = ObservableFactory.create([]);
  let count = 0;
  // any published change will inc count
  observable.subscribe(() => count++);
  const arr = [1, 2];
  observable.value = arr; // count++
  arr.push(3); // no count++ because arr is not being replaced
  observable.value = [1, 2, 3]; // count++
  assertEquals(count, 2);
  arr.push(4); // no count++ because arr is not being replaced
  assertEquals(count, 2);
  observable.value = [1, 2, 3, 4]; // count++
  assertEquals(count, 3);
});

// Requirement 3
Deno.test("Observable sets value with a function and arguments", () => {
  const func = (a: number, b: number) => a + b;
  const observable = ObservableFactory.create(func, 3, 4);
  assertEquals(observable.value, 7);
});

// Requirement 3.5
Deno.test(
  "Observable sets value with a function and variable number of arguments",
  () => {
    const func = (...args: number[]) =>
      args.reduce((acc, value) => acc + value, 0);
    const observable = ObservableFactory.create(func, 3, 4, 5, 6); // You can pass any number of arguments here
    assertEquals(observable.value, 18); // The sum of 3, 4, 5, and 6
  }
);

// Requirements 4 & 5
Deno.test("Observable recomputes value when child observables change", () => {
  const childObservable = ObservableFactory.create(5);
  const func = () => childObservable.value * 2;
  const parentObservable = ObservableFactory.create(func);
  assertEquals(parentObservable.value, 10);
  childObservable.value = 10;
  assertEquals(parentObservable.value, 20);
});

// Requirement 6
Deno.test("ObservableValue compute with async function", async () => {
  const observable = ObservableFactory.create(0);
  const func = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 42;
  };
  observable.compute(func);
  await observable.compute(); // Wait for async resolution
  assertEquals(observable.accessor(), 42);
});
