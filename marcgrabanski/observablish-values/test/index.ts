import { assertEquals } from "https://deno.land/std@0.199.0/testing/asserts.ts";
import { ObservableFactory, ObservableValue } from "../observable.ts"; // Adjust the import path

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

// Additional tests for compute, unsubscribe, etc. can be added here
