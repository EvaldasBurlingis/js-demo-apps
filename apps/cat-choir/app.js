window.addEventListener("keydown", (e) => {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const card = document.querySelector(".card");

    if(!audio) return; // Break out if no associated key found

    card.style.display = "none";

    audio.currentTime = 0;
    audio.play();

    addRandomImage();
});

addRandomImage = () => {
    const section = document.querySelector(".section");
    const img = document.createElement("img");

    img.src = `./cats/${getRandom(4)}.png`;
    img.style.position = "absolute";
    img.style.top = `${getRandom(window.innerHeight)}px`;
    img.style.left = `${getRandom(window.innerWidth)}px`;

    section.appendChild(img)
}

const getRandom = num => Math.floor(Math.random() * Math.floor(num)) + 1;