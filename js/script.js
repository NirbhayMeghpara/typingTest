const loading = document.querySelector("#loader-wrapper")
let onceLoaded = false

document.addEventListener("load", loaded())

function loaded() {
  setInterval(() => {
    if (!onceLoaded) {
      loading.classList.add("loaded")
      onceLoaded = true
    } else {
      clearInterval()
      loading.style.zIndex = "-1000"
    }
  }, 1000)
}

const allBulb = document.querySelectorAll(".cardboard .light-bulb .base .bulb")

allBulb.forEach((bulb) => {
  bulb.addEventListener("click", () => {
    bulb.classList.toggle("glow")
  })
})

const typingText = document.querySelector(".typing-text p")
const inputField = document.querySelector(".wrapper .input-field")
const mistake = document.querySelector(".mistake span")
const timeCount = document.querySelector(".time span b")
const wordSpeed = document.querySelector(".wpm span")
const accuracyCount = document.querySelector(".accuracy span b")
const restartBtn = document.querySelector("button")
const restartBtnIcon = document.querySelector("button i")

let timer,
  maxTime = 60,
  timeLeft = maxTime
let flag = false
let index = (mistakesCount = 0)

selectWord()

inputField.addEventListener("input", startTyping)
restartBtn.addEventListener("click", restart)

inputField.addEventListener("keydown", function (event) {
  const key = event.key
  if (
    (event.ctrlKey && (key === "Backspace" || key === "Delete")) ||
    key === "Delete"
  ) {
    event.preventDefault()
  }
})

restartBtn.addEventListener("keydown", (e) => {
  if (e.key === "Tab") e.preventDefault()
  else if (e.key === "Enter") restart()
})

restartBtn.addEventListener("focus", (e) => {
  restartBtn.style.background = "white"
  restartBtn.style.border = "none"
  restartBtnIcon.style.color = "black"
})

restartBtn.addEventListener("blur", (e) => {
  restartBtn.style.border = "2px solid #17A2B8"
  restartBtnIcon.style.color = "#17A2B8"
  restartBtn.style.background = "transparent"
})

function selectWord() {
  const selectedWords = []

  while (selectedWords.length < 60) {
    const randomIndex = Math.floor(Math.random() * words.length)
    const randomWord = words[randomIndex]
    if (!selectedWords.includes(randomWord)) {
      selectedWords.push(randomWord)
    }
  }

  const paragraph = selectedWords.join(" ")

  paragraph.split("").forEach((span) => {
    let spanTag = `<span>${span}</span>`
    typingText.innerHTML += spanTag
  })

  document.addEventListener("keydown", () => inputField.focus())
  typingText.addEventListener("click", () => inputField.focus())
}

function startTyping() {
  const characters = typingText.querySelectorAll("span")
  let typedChar = inputField.value.split("")[index]

  if (timeLeft > 0 && index < characters.length - 1) {
    if (!flag) {
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--
        } else {
          clearInterval(timer)
        }
      }, 1000)

      if (timeLeft != 0) {
        let display = setInterval(() => {
          timeCount.innerText = timeLeft
          let wpm = Math.round(
            (((index - mistakesCount) / 4) * 60) / (maxTime - timeLeft)
          )
          wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm
          wordSpeed.innerText = wpm
          let accuracy = Math.round(((index - mistakesCount) * 100) / index)
          accuracy =
            accuracy < 0 || !accuracy || accuracy === Infinity ? 0 : accuracy
          accuracyCount.innerText = accuracy
        }, 1000)
      } else clearInterval(display)

      flag = true
    }

    if (typedChar == null) {
      --index
      if (
        characters[index].classList.contains("incorrect") ||
        characters[index].classList.contains("correct")
      ) {
        characters[index].classList.remove("incorrect", "correct")
      }
    } else {
      if (characters[index].innerText === typedChar) {
        characters[index].classList.add("correct")
      } else {
        mistakesCount++
        characters[index].classList.add("incorrect")
      }
      index++
    }
    characters.forEach((span) => span.classList.remove("active"))
    characters[index].classList.add("active")
    mistake.innerText = mistakesCount
  } else {
    inputField.setAttribute("disabled", true)
    inputField.value = ""
    clearInterval(timer)
  }
}

function restart() {
  typingText.innerHTML = ""
  selectWord()
  ;(maxTime = 60), (timeLeft = maxTime)
  timeCount.innerText = maxTime
  flag = false
  index =
    mistakesCount =
    mistake.innerText =
    wordSpeed.innerText =
    accuracyCount.innerText =
      0
  inputField.value = ""
  inputField.removeAttribute("disabled", true)
  clearInterval(timer)
}
