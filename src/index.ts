import { format } from "date-fns";

document.addEventListener("DOMContentLoaded", main);

function main() {
  const horizontalTimerElement = document.getElementById("timer-horizontal")!;

  const horizontalHourElement = document.getElementById("vtimer-h")!;
  const horizontalMinuteElement = document.getElementById("vtimer-m")!;
  const horizontalSecondElement = document.getElementById("vtimer-s")!;

  setInterval(() => {
    const now = new Date();
    horizontalTimerElement.innerText = format(now, "HH:mm:ss");

    horizontalHourElement.innerText = format(now, "HH");
    horizontalMinuteElement.innerText = format(now, "mm");
    horizontalSecondElement.innerText = format(now, "ss");
  }, 500);
}
