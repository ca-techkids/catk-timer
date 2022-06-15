document.addEventListener("DOMContentLoaded", main);

function main() {
  const inputElement = document.getElementById("comment-input")!;

  inputElement.addEventListener("input", onInput);
}

function onInput(event: Event) {
  console.log("changed!");
  const target = event.target as HTMLInputElement;

  localStorage.setItem("comment", target.value);
}
