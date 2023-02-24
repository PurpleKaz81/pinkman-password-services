import * as bootstrap from "bootstrap"
import randomPassword from "secure-random-password"
const { digits, lower, upper, symbols } = randomPassword

const ENTER = "Enter"
const inputFields = document.querySelectorAll("input")
const SHOW_ERROR_ANIMATION_INTERVAL_MS = 400
const SHOW_ERROR_ANIMATION_DURATION_MS = 1000
const SHOW_SUCCESS_ANIMATION_INTERVAL_MS = 200
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
].map((selector) => document.querySelector(selector))

const generateRandomInt = (min, max) => {
  const range = max - min + 1
  const bytesNeeded = Math.ceil(Math.log2(range) / 8)
  if (bytesNeeded > 6) {
    throw new Error("Too many bytes needed")
  }
  const randomBytes = new Uint8Array(bytesNeeded)
  window.crypto.getRandomValues(randomBytes)
  let value = 0
  for (let i = 0; i < bytesNeeded; i += 1) {
    value = value * 256 + randomBytes[i]
  }
  return min + (value % range)
}

const generateRandomPassword = () => {
  const randomPasswordLength = generateRandomInt(8, 12)
  const characters = [digits, lower, upper, symbols]
  return randomPassword.randomPassword({ randomPasswordLength, characters })
}

const copyPasswordToClipboard = (password) => {
  const popover = new bootstrap.Popover(generateField)
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
  const passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z\d]).{8,}$/
  return passwordPattern.test(passwordField.value)
}

const showErrorAnimation = () => {
  let opacity = 1
  const interval = setInterval(() => {
    opacity = opacity ? 0 : 1
    errorMsg.style.opacity = opacity
  }, SHOW_ERROR_ANIMATION_INTERVAL_MS)
  setTimeout(() => {
    clearInterval(interval)
    errorMsg.style.opacity = 1
  }, SHOW_ERROR_ANIMATION_DURATION_MS)
}

const showSuccessAnimation = (timesToBlink) => {
  const SHOW_SUCCESS_ANIMATION_DURATION_MS =
    SHOW_SUCCESS_ANIMATION_INTERVAL_MS * timesToBlink * 2
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
  }, SHOW_SUCCESS_ANIMATION_INTERVAL_MS)
  setTimeout(() => {
    clearInterval(interval)
    modalSuccess.style.opacity = 1
  }, SHOW_SUCCESS_ANIMATION_DURATION_MS)
}

window.addEventListener("DOMContentLoaded", () => {
  inputFields.forEach((inputField) => {
    inputField.addEventListener("keydown", (event) => {
      if (event.key === ENTER) {
        event.preventDefault()
      }
    })
  })

  generateButton?.addEventListener("click", handleGenerateButton)

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

  const addEventListeners = (element, types, handler) => {
    types.forEach((type) => element.addEventListener(type, handler))
  }

  const toggleHandler = (button, field) => () => {
    togglePasswordVisibility(button, field)
  }

  const handleSubmitEvent = (event) => {
    event.preventDefault()
    if (!validatePassword()) {
      errorMsg.textContent =
        "Password must have at least 8 characters and contain at least one uppercase letter, one number, and one special character."
      showErrorAnimation()
    } else {
      errorMsg.textContent = ""
      const successModal = new bootstrap.Modal(
        document.querySelector("#success-modal")
      )
      modalBody.textContent = "Congrats on a strong password!"
      modalBody.style.fontFamily = "Oswald, sans-serif"
      successModal.show()
      showSuccessAnimation(5)

      const hideModalOnKeyDown = (e) => {
        if (e.key === ENTER) {
          successModal.hide()
          document.removeEventListener("keydown", hideModalOnKeyDown)
        }
      }
      successModal._element.addEventListener("keydown", hideModalOnKeyDown)
    }
  }

  addEventListeners(
    toggleButton1,
    ["click", "touchstart"],
    toggleHandler(toggleButton1, generateField)
  )
  addEventListeners(
    toggleButton2,
    ["click", "touchstart"],
    toggleHandler(toggleButton2, passwordField)
  )

  addEventListeners(submitButton, ["click", "touchstart"], handleSubmitEvent)

  passwordField?.addEventListener("keydown", (event) => {
    if (event.key === ENTER) {
      event.preventDefault()
      submitButton?.click()
    }
  })
})
