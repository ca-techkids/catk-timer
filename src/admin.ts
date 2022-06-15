document.addEventListener("DOMContentLoaded", main);

let inputElement: HTMLTextAreaElement;
let deleteButton: HTMLElement;

function main() {
  inputElement = document.getElementById(
    "comment-input"
  )! as HTMLTextAreaElement;
  deleteButton = document.getElementById("comment-delete")!;

  inputElement.addEventListener("input", onInput);
  deleteButton.addEventListener("click", onDelete);
}

function onInput(event: Event) {
  console.log("changed!");
  const target = event.target as HTMLInputElement;

  localStorage.setItem("comment", target.value);
}

function onDelete() {
  localStorage.setItem("comment", "");
  inputElement.value = "";
}
