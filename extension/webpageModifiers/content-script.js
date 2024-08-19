document.body.style.backgroundColor = "coral";
const counterButton = document.getElementById("counter");
if (counterButton === null) {
    console.error("Counter button not found");
}
else {
    counterButton.onclick = () => {
        alert("Counter button clicked");
        console.log("first log");
    };
}
