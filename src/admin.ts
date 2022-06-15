import { addHours, format } from "date-fns";

type ScheduledComment = {
  date: Date;
  comment: string;
};

document.addEventListener("DOMContentLoaded", main);

let scheduledComments: ScheduledComment[] = [];

let inputElement: HTMLTextAreaElement;
let deleteButton: HTMLButtonElement;
let submitButton: HTMLButtonElement;
let scheduledCommentInputElement: HTMLTextAreaElement;
let scheduledTimeInputElement: HTMLInputElement;
let scheduledSubmitButton: HTMLInputElement;
let scheduledCommentListElement: HTMLDivElement;

function main() {
  initElements();

  watchScheduledComment();

  submitButton.addEventListener("click", onSubmit);
  deleteButton.addEventListener("click", onDelete);

  scheduledSubmitButton.addEventListener("click", onScheduledCommentSubmit);
}

function initElements() {
  inputElement = document.getElementById(
    "comment-input"
  )! as HTMLTextAreaElement;

  deleteButton = document.getElementById("comment-delete") as HTMLButtonElement;
  submitButton = document.getElementById("comment-submit") as HTMLButtonElement;

  scheduledCommentInputElement = document.getElementById(
    "scheduled-comment-input"
  ) as HTMLTextAreaElement;

  scheduledTimeInputElement = document.getElementById(
    "scheduled-comment-time"
  ) as HTMLInputElement;

  scheduledSubmitButton = document.getElementById(
    "scheduled-comment-submit"
  ) as HTMLInputElement;

  scheduledCommentListElement = document.getElementById(
    "scheduled-comment-list"
  ) as HTMLDivElement;
}

function onSubmit() {
  const comment = inputElement.value || "";
  localStorage.setItem("comment", comment);

  inputElement.value = "";
}

function onDelete() {
  localStorage.setItem("comment", "");
  inputElement.value = "";
}

function onScheduledCommentSubmit() {
  let time = scheduledTimeInputElement.valueAsDate;
  const comment = scheduledCommentInputElement.value;

  if (!time) {
    window.alert("予約投稿の時刻は空にできません");
    return;
  }

  const now = new Date();
  time = addHours(time, -9); // JSTに変換する
  time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate()); // 現在の年月日を設定する

  if (time.getTime() <= now.getTime()) {
    window.alert("現在より過去の時刻に予約投稿することはできません");
  }

  scheduledComments.push({
    comment: comment || "",
    date: time,
  });

  scheduledCommentInputElement.innerText = "";
  scheduledTimeInputElement.innerText = "";

  updateScheduledCommentList();
}

function updateScheduledCommentList() {
  const sortedComments = Array.from(scheduledComments).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  scheduledCommentListElement.innerText = "";

  sortedComments.forEach((comment) => {
    const listItemElement = document.createElement("div");
    listItemElement.classList.add("list-item");

    const commentElement = document.createElement("div");
    commentElement.classList.add("list-item-comment");
    commentElement.innerText = comment.comment;

    const timeElement = document.createElement("div");
    timeElement.classList.add("list-item-time");
    timeElement.innerText = format(comment.date, "HH:mm");

    const scheduleDeleteButton = document.createElement("button");
    scheduleDeleteButton.classList.add("button", "red", "small");
    scheduleDeleteButton.innerText = "予約解除";
    scheduleDeleteButton.addEventListener("click", () =>
      removeSchedule(comment)
    );

    listItemElement.append(timeElement, commentElement, scheduleDeleteButton);
    scheduledCommentListElement.append(listItemElement);
  });
}

function watchScheduledComment() {
  setInterval(() => {
    const now = new Date();
    const removeSchedules: ScheduledComment[] = [];

    scheduledComments.forEach((comment) => {
      if (comment.date.getTime() <= now.getTime()) {
        localStorage.setItem("comment", comment.comment);
        removeSchedules.push(comment);
      }
    });

    scheduledComments = scheduledComments.filter(
      (c) => !removeSchedules.includes(c)
    );
    updateScheduledCommentList();
  }, 1000);
}

function removeSchedule(targetComment: ScheduledComment) {
  scheduledComments = scheduledComments.filter((c) => c !== targetComment);
  updateScheduledCommentList();
}
