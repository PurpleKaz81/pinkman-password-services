import { Modal, Popover } from "bootstrap"
import {
  randomPassword,
  digits,
  lower,
  upper,
  symbols,
} from "secure-random-password"
import crypto from "crypto"

// Destructure required elements from the DOM
const ENTER = "Enter"
const inputFields = document.querySelectorAll("input")
const [
  generateButton,
  generateField,
  passwordField,
  toggleButton1,
  toggleButton2,
  submitButton,
  errorMsg,
  modalSuccess,
  modalBody,
] = [
  "#generate-btn",
  "#generated-password-input",
  "#password-input",
  "#toggle-password-top",
  "#toggle-password-bottom",
  "#submit-btn",
  "#error-msg",
  "#success-modal-label",
  "#modal-body",
].map(selector => document.querySelector(selector))

const generateRandomInt = (min, max) => {
  const range = max - min + 1
  const bytesNeeded = Math.ceil(Math.log2(range) / 8)
  if (bytesNeeded > 6) {
    throw new Error("Too many bytes needed")
  }
  const randomBytes = crypto.randomBytes(bytesNeeded)
  let value = 0
  for (let i = 0; i < bytesNeeded; i += 1) {
    value = value * 256 + randomBytes[i]
  }
  return min + (value % range)
}

const generateRandomPassword = () => {
  const length = generateRandomInt(8, 12)
  const characters = [digits, lower, upper, symbols]
  return randomPassword({ length, characters })
}

const copyPasswordToClipboard = (password) => {
  const popover = new Popover(generateField)
  popover.show()

  const dismissPopover = () => {
    popover.hide()
    document.removeEventListener("click", dismissPopover)
    document.removeEventListener("touchstart", dismissPopover)
  }

  // Hide the popover when it is hidden
  generateField.addEventListener("hidden.bs.popover", dismissPopover)

  // Remove the event listener for clicks when the popover is hidden
  generateField.addEventListener("hide.bs.popover", () => {
    document.removeEventListener("click", dismissPopover)
    document.removeEventListener("touchstart", dismissPopover)
  })

  // Add the event listener for clicks when the popover is shown
  generateField.addEventListener("shown.bs.popover", () => {
    document.addEventListener("click", dismissPopover)
    document.addEventListener("touchstart", dismissPopover)
  })

  navigator.clipboard
    .writeText(password)
    .then(() => {})
    .catch((err) => {
      console.error("Failed to copy password ", err)
    })
}

const handleGenerateButton = () => {
  const password = generateRandomPassword()
  generateField.value = password

  copyPasswordToClipboard(password)
}

const validatePassword = () => {
  const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z\d]).{8,}$/
  return passwordPattern.test(passwordField.value)
}

const blinkErrorMessage = () => {
  let opacity = 1
  const interval = setInterval(() => {
    opacity = opacity ? 0 : 1
    errorMsg.style.opacity = opacity
  }, 400)
  setTimeout(() => {
    clearInterval(interval)
    errorMsg.style.opacity = 1
  }, 1000)
}

const blinkSuccess = (timesToBlink) => {
  let opacity = 1
  let blinkCount = 0
  const interval = setInterval(() => {
    opacity = opacity ? 0 : 1
    modalSuccess.style.opacity = opacity
    blinkCount += 1
    if (blinkCount === timesToBlink * 2) {
      clearInterval(interval)
      modalSuccess.style.opacity = 1
    }
  }, 200)
}

window.addEventListener("DOMContentLoaded", () => {
  inputFields.forEach((inputField) => {
    inputField.addEventListener("keydown", (event) => {
      if (event.key === ENTER) {
        event.preventDefault()
      }
    })
  })

  if (generateButton) {
    generateButton.addEventListener("click", handleGenerateButton)
  }

  const togglePasswordVisibility = (button, field) => {
    if (field.type === "password") {
      field.type = "text"
      button.classList.remove("fa-eye-slash")
      button.classList.add("fa-eye")
    } else {
      field.type = "password"
      button.classList.remove("fa-eye")
      button.classList.add("fa-eye-slash")
    }
  }

  if (toggleButton1) {
    toggleButton1.addEventListener("click", () => {
      togglePasswordVisibility(toggleButton1, generateField)
    })
    toggleButton1.addEventListener("touchstart", () => {
      togglePasswordVisibility(toggleButton1, generateField)
    })
  }

  if (toggleButton2) {
    toggleButton2.addEventListener("click", () => {
      togglePasswordVisibility(toggleButton2, passwordField)
    })
    toggleButton2.addEventListener("touchstart", () => {
      togglePasswordVisibility(toggleButton2, passwordField)
    })
  }

  if (submitButton) {
    submitButton.addEventListener("click", (event) => {
      event.preventDefault()
      if (!validatePassword()) {
        errorMsg.textContent = "Password must have at least 8 characters and contain at least one uppercase letter, one number, and one special character."
        blinkErrorMessage()
      } else {
        errorMsg.textContent = ""
        const successModal = new Modal(
          document.querySelector("#success-modal")
        )
        modalBody.textContent = "Congrats on a strong password!"
        modalBody.style.fontFamily = "Oswald, sans-serif"
        successModal.show()
        blinkSuccess(5)

        const hideModalOnKeyDown = (e) => {
          if (e.key === ENTER) {
            successModal.hide()
            document.removeEventListener("keydown", hideModalOnKeyDown)
          }
        }

        // eslint-disable-next-line no-underscore-dangle
        successModal._element.addEventListener("keydown", hideModalOnKeyDown)
      }
    })
  }

  if (submitButton) {
    submitButton.addEventListener("touchstart", (event) => {
      event.preventDefault()
      if (!validatePassword()) {
        errorMsg.textContent = "Password must have at least 8 characters and contain at least one uppercase letter, one number, and one special character."
        blinkErrorMessage()
      } else {
        errorMsg.textContent = ""
        const successModal = new Modal(
          document.querySelector("#success-modal")
        )
        modalBody.textContent = "Congrats on a strong password!"
        modalBody.style.fontFamily = "Oswald, sans-serif"
        successModal.show()
        blinkSuccess(5)

        const hideModalOnKeyDown = (e) => {
          if (event.key === ENTER) {
            successModal.hide()
            document.removeEventListener("keydown", hideModalOnKeyDown)
          }
        }
        document.addEventListener("keydown", hideModalOnKeyDown)
      }
    })
  }

  if (passwordField) {
    passwordField.addEventListener("keydown", (event) => {
      if (event.key === ENTER) {
        event.preventDefault()
        submitButton.click()
      }
    })
  }
})
