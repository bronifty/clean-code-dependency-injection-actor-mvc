// This code doesn't work, we'll explore why soon
class MainButtonElement {
  count = 0;
  constructor(parent) {
    this.el = document.createElement("button");
    this.updateText();
    this.addCountListeners();
    parent.append(this.el);
  }
  updateText() {
    this.el.innerText = `Add: ${this.count}`;
  }
  add() {
    this.count++;
    this.updateText();
  }
  addCountListeners() {
    this.el.addEventListener("click", this.add);
  }
  destroy() {
    this.el.remove();
    this.el.removeEventListener("click", this.add);
  }
}
new MainButtonElement(document.body);
