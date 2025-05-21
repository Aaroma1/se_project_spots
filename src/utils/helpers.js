export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }

  if (btn.classList.contains("modal__button_type_delete")) {
    btn.textContent = isLoading ? "Deleting..." : "Yes";
  }
}
