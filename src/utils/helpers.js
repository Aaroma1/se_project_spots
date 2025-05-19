export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    // set loading text
    console.log(`Setting text to ${loadingText}`);
  } else {
    //set not loading
  }
}

// fill in the details here.

// export function setButtonText(button, isLoading, action = "Saving") {
//   button.textContent = isLoading ? `${action}...` : "Save";

//   // Special case for delete button
//   if (button.classList.contains("modal__button_type_delete")) {
//     button.textContent = isLoading ? "Deleting..." : "Yes";
//   }
// }
