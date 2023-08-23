// function ObservableValue() {
//   this.previousValue = null;
//   this.value = null;
//   this.subscribers = [];
// }
type ObservableValueProps<T> = {
  previousValue: T | null;
  value: T | null;
  subscribers: Array<(current: T, previous: T | null) => void>;
};
class ObservableValue<T> {
  previousValue: T | null = null;
  value: T | null = null;
  subscribers: Array<(current: T, previous: T | null) => void> = [];

  // You can add methods here later
}
