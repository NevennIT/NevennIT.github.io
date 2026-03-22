const numParticles = 60;

for (let i = 0; i < numParticles; i++) {
    let particle = document.createElement("div");
    particle.classList.add("particle");

    let size = Math.random() * 5 + 100;
    particle.style.width = size + "px";
    particle.style.height = size + "px";

    // Position X aléatoire
    particle.style.left = Math.random() * 100 + "vw";

    // IMPORTANT FIX : position Y aléatoire au départ
    particle.style.top = Math.random() * 100 + "vh";

    // Durée
    particle.style.animationDuration = (Math.random() * 15 + 10) + "s";

    // Décalage négatif pour éviter l'effet ligne au chargement
    particle.style.animationDelay = -(Math.random() * 20) + "s";

    document.body.appendChild(particle);
}