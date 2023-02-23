import { Modal, Popover } from 'bootstrap'
import {
  randomPassword, digits, lower, upper, symbols
} from 'secure-random-password'
import crypto from 'crypto'

window.addEventListener("DOMContentLoaded", () => {
  const inputFields = document.querySelectorAll("input")
  inputFields.forEach((inputField) => {
    inputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
      }
    })
  })

  const generateButton = document.querySelector("#generate-btn")
  const generateField = document.querySelector("#generated-password-input")
  const passwordField = document.querySelector("#password-input")
  const toggleButton1 = document.querySelector("#toggle-password-top")
  const toggleButton2 = document.querySelector("#toggle-password-bottom")

  if (generateButton) {
    generateButton.addEventListener("click", () => {
      function generateRandomInt(min, max) {
        const range = max - min + 1
        const bytesNeeded = Math.ceil(Math.log2(range) / 8)
        if (bytesNeeded > 6) {
          throw new Error('Too many bytes needed')
        }
        const randomBytes = crypto.randomBytes(bytesNeeded)
        let value = 0
        for (let i = 0; i < bytesNeeded; i += 1) {
          value = (value * 256) + randomBytes[i]
        }
        return min + (value % range)
      }

      const length = generateRandomInt(8, 12)

      const characters = [digits, lower, upper, symbols]
      const password = randomPassword({ length, characters })
      generateField.value = password

      navigator.clipboard.writeText(password)
        .then(() => {
          const popover = new Popover(generateField)
          popover.show()

          function dismissPopover() {
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
        })
        .catch((err) => {
          console.error("Failed to copy password ", err)
        })
    })
  }

  if (toggleButton1) {
    toggleButton1.addEventListener("click", () => {
      if (generateField.type === "password") {
        generateField.type = "text"
        toggleButton1.classList.remove("fa-eye-slash")
        toggleButton1.classList.add("fa-eye")
      } else {
        generateField.type = "password"
        toggleButton1.classList.remove("fa-eye")
        toggleButton1.classList.add("fa-eye-slash")
      }
    })
  }

  if (toggleButton1) {
    toggleButton1.addEventListener("touchstart", () => {
      if (generateField.type === "password") {
        generateField.type = "text"
        toggleButton1.classList.remove("fa-eye-slash")
        toggleButton1.classList.add("fa-eye")
      } else {
        generateField.type = "password"
        toggleButton1.classList.remove("fa-eye")
        toggleButton1.classList.add("fa-eye-slash")
      }
    })
  }

  if (toggleButton2) {
    toggleButton2.addEventListener("click", () => {
      if (passwordField.type === "password") {
        passwordField.type = "text"
        toggleButton2.classList.remove("fa-eye-slash")
        toggleButton2.classList.add("fa-eye")
      } else {
        passwordField.type = "password"
        toggleButton2.classList.remove("fa-eye")
        toggleButton2.classList.add("fa-eye-slash")
      }
    })
  }

  if (toggleButton2) {
    toggleButton2.addEventListener("touchstart", () => {
      if (passwordField.type === "password") {
        passwordField.type = "text"
        toggleButton2.classList.remove("fa-eye-slash")
        toggleButton2.classList.add("fa-eye")
      } else {
        passwordField.type = "password"
        toggleButton2.classList.remove("fa-eye")
        toggleButton2.classList.add("fa-eye-slash")
      }
    })
  }

  function validatePassword() {
    const passwordInput = document.querySelector("#password-input")
    const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z\d]).{8,}$/
    return passwordPattern.test(passwordInput.value)
  }

  const submitButton = document.querySelector("#submit-btn")
  const errorMsg = document.querySelector("#error-msg")
  const modalSuccess = document.querySelector("#success-modal-label")
  const modalBody = document.querySelector("#modal-body")

  function blinkErrorMessage() {
    let opacity = 1
    const interval = setInterval(() => {
      opacity = opacity ? 0 : 1
      errorMsg.style.opacity = opacity
    }, 400);
    setTimeout(() => {
      clearInterval(interval)
      errorMsg.style.opacity = 1
    }, 1000)
  }

  function blinkSuccess(timesToBlink) {
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

  if (submitButton) {
    submitButton.addEventListener("click", (event) => {
      event.preventDefault()
      if (!validatePassword()) {
        errorMsg.textContent = "Password must have at least 8 characters and contain at least one uppercase letter, one number, and one special character."
        blinkErrorMessage()
      } else {
        errorMsg.textContent = ""
        const successModal = new Modal(document.querySelector("#success-modal"))
        modalBody.textContent = "Congrats on a strong password!"
        modalBody.style.fontFamily = "Oswald, sans-serif"
        successModal.show()
        blinkSuccess(5)

        const hideModalOnKeyDown = (e) => {
          if (e.key === "Enter") {
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
        const successModal = new Modal(document.querySelector("#success-modal"))
        modalBody.textContent = "Congrats on a strong password!"
        modalBody.style.fontFamily = "Oswald, sans-serif"
        successModal.show()
        blinkSuccess(5)

        const hideModalOnKeyDown = (e) => {
          if (event.key === "Enter") {
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
      if (event.key === "Enter") {
        event.preventDefault()
        submitButton.click()
      }
    })
  }
})
