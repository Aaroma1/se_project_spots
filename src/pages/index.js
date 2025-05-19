import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";
import Logo from "../images/Logo.svg";
import avatar from "../images/avatar.jpg";
import pencilIcon from "../images/pencil.svg";
import plusIcon from "../images/plus.svg";

document.querySelector(".header__logo").src = Logo;
document.querySelector(".profile__btn-icon").src = pencilIcon;
document.querySelector(".profile__add-btn img").src = plusIcon;

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Landscape Preview",
//     link: " https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3eb5a4df-f597-4a49-8c69-ddec74885a30",
    "Content-Type": "application/json",
  },
});

function setUserInfo(userData) {
  console.log("User Data:", userData);
  const profileAvatar = document.querySelector(".profile__avatar");
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");

  profileAvatar.src = userData.avatar;
  profileName.textContent = userData.name;
  profileDescription.textContent = userData.about;
}

api
  .getAppInfo()
  .then(([userData, cards]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    setUserInfo(userData);
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector("#profile-form");

const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector("#add-card-form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");

const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#add-avatar-form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector(".modal__input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

const modals = document.querySelectorAll(".modal");

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardElement.dataset.cardId;
  openModal(deleteModal);
}

function handleLike(evt, cardId) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_liked");

  api
    .handleLike(cardId, isLiked)
    .then((res) => {
      if (res.isLiked) {
        likeButton.classList.add("card__like-btn_liked");
      } else {
        likeButton.classList.remove("card__like-btn_liked");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const imageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardElement.dataset.cardId = data._id;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardNameEl.textContent = data.name;
  imageEl.src = data.link;
  imageEl.alt = data.name;

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  imageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  api
    .addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      cardForm.reset();
      disableButton(cardSubmitBtn, validationConfig);
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatar = document.querySelector(".profile__avatar");
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      avatar.src = data.avatar;
      avatarForm.reset();
      disableButton(avatarSubmitBtn, validationConfig);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);
const cancelButton = deleteModal.querySelector(
  ".modal__submit-btn:last-of-type"
);
cancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (
      evt.target.classList.contains("modal__close-btn") ||
      evt.target.classList.contains("modal_opened")
    ) {
      closeModal(modal);
    }
  });
});

enableValidation(validationConfig);
