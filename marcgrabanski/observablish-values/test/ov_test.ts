import { assertEquals } from "https://deno.land/std@0.199.0/testing/asserts.ts";
import ov from "../ov.ts";

// Test: Publish and subscribe
Deno.test("ov publish and subscribe", () => {
  const observable = ov("initial");
  let lastValue: string | null = null;
  observable.subscribe((current: string) => {
    lastValue = current;
  });
  observable("new");
  assertEquals(lastValue, "new");
});

// Test: Publish on array replacement, not modification
Deno.test("ov publish on array replacement, not modification", () => {
  const observable = ov([1, 2]);
  let count = 0;
  observable.subscribe(() => count++);
  const arr = observable();
  arr.push(3); // Should not trigger
  observable.publish(); // Trigger once
  observable([4, 5]); // Trigger again
  assertEquals(count, 2);
});

// Test: Computed value with child observables
Deno.test("ov recomputes value when child observables change", () => {
  const a = ov(1);
  const b = ov(2);
  const computed = ov((arg: number) => a() + b() + arg, 3);
  assertEquals(computed(), 6);
  a(2);
  assertEquals(computed(), 7);
});
