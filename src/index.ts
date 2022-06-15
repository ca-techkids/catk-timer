import { format } from "date-fns";

document.addEventListener("DOMContentLoaded", main);

let commentElement: HTMLElement;
let horizontalTimerElement: HTMLElement;
let horizontalHourElement: HTMLElement;
let horizontalMinuteElement: HTMLElement;
let horizontalSecondElement: HTMLElement;

function main() {
  commentElement = document.getElementById("comment")!;

  horizontalTimerElement = document.getElementById("timer-horizontal")!;

  horizontalHourElement = document.getElementById("vtimer-h")!;
  horizontalMinuteElement = document.getElementById("vtimer-m")!;
  horizontalSecondElement = document.getElementById("vtimer-s")!;

  updateComment();
  updateTimer();
}

function updateComment() {
  commentElement.innerText = localStorage.getItem("comment") || "";
  window.addEventListener("storage", onStorage);
}

function onStorage(event: StorageEvent) {
  if (event.key !== "comment") return;

  commentElement.innerText = event.newValue || "";
}

function updateTimer() {
  setInterval(() => {
    const now = new Date();
    horizontalTimerElement.innerText = format(now, "HH:mm:ss");

    horizontalHourElement.innerText = format(now, "HH");
    horizontalMinuteElement.innerText = format(now, "mm");
    horizontalSecondElement.innerText = format(now, "ss");
  }, 500);
}
