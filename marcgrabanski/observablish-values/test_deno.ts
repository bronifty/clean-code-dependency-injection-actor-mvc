import { assertEquals } from "https://deno.land/std@0.199.0/testing/asserts.ts";
import { ObservableFactory } from "./observable.ts";

Deno.test("Observable publish and subscribe", () => {
  const observable = ObservableFactory.create(42);
  let lastValue: number | null = null;
  observable.subscribe((current) => {
    lastValue = current;
  });
  observable.value = 42;
  assertEquals(lastValue, 42);
});

Deno.test("Observable publish on array replacement, not modification", () => {
  const observable = ObservableFactory.create<number[]>([]);
  let count = 0;
  observable.subscribe(() => count++);
  const arr = [1, 2];
  observable.value = arr; // Trigger once
  arr.push(3); // Should not trigger
  observable.value = [1, 2, 3]; // Trigger again
  assertEquals(count, 2);
});

Deno.test("Observable sets value with a function and arguments", () => {
  const func = (a: number, b: number) => a + b;
  const observable = ObservableFactory.create(func, 3, 4);
  assertEquals(observable.value, 7);
});

Deno.test("Observable recomputes value when child observables change", () => {
  const childObservable = ObservableFactory.create(5);

  const func = () => childObservable.value * 2;
  const parentObservable = ObservableFactory.create(func);

  assertEquals(parentObservable.value, 10);

  // Change the value of the child observable
  childObservable.value = 10;

  // Check that the parent observable has recomputed its value based on the child observable's change
  assertEquals(parentObservable.value, 20);
});
