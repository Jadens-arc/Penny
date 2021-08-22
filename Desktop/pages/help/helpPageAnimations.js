const shocker = document.getElementById("shocker");

for (let i = 0; i < shocker.children.length; i++) {
  shocker.children[i].style.animation = `fadeSlideUp 1s ${
    i + 5
  }s ease forwards`;
}
