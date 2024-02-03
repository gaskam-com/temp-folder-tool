import Confetti from "./assets/confetti.min.js";


window.onload = ()=> {
    let confettiSettings = new Confetti('confettiSettings');
    
    confettiSettings.setCount(150);
    confettiSettings.setSize(1);
    confettiSettings.setPower(25);
    confettiSettings.setFade(true);
    confettiSettings.destroyTarget(false);
}