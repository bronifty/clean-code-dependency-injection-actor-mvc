import { assertEquals } from "https://deno.land/std@0.199.0/testing/asserts.ts";
import { ObservableFactory, ObservableValue } from "../observable.js"; // Adjust the import path

Deno.test("ObservableValue accessor initially returns null", () => {
  const observable = new ObservableValue<string>();
  assertEquals(observable.accessor(), null);
});

Deno.test("ObservableValue accessor sets and gets value", () => {
  const observable = new ObservableValue<string>();
  observable.accessor("Hello");
  assertEquals(observable.accessor(), "Hello");
});

Deno.test("ObservableValue publish and subscribe", () => {
  const observable = new ObservableValue<number>();
  let lastValue: number | null = null;
  observable.subscribe((current) => {
    lastValue = current;
  });

  observable.accessor(42);
  assertEquals(lastValue, 42);
});

Deno.test("ObservableFactory creates ObservableValue", () => {
  const factory = ObservableFactory;
  const observable = factory.createObservableValue<string>("initial");
  assertEquals(observable.accessor(), "initial");
});

Deno.test(
  "ObservableValue accessor sets value with a function and arguments",
  () => {
    const observable = new ObservableValue<number>();
    const func = (a: number, b: number) => a + b;
    observable.accessor(func, 3, 4); // Passing function and arguments to set value as 3 + 4
    assertEquals(observable.accessor(), 7);
  }
);

// Additional tests for compute, unsubscribe, etc. can be added here
