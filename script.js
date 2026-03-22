 const words = [
      "SAP", "SAP-IM", "SAP-WM", "MICROSOFT", "EXCEL", "WORD", "VBA", "GOOGLE", "DRIVE", "ONEDRIVE", "IMPORTRANGE", "POWER QUERY", "DATA", "ANALYSE",
      "SEEQ", "GSHEET", "PI VISION", "VISUAL BASIC", "JAVASCRIPT", "OUTLOOK", "MICROSOFT 365", "BUREAUTIQUE"
    ];

    const numWords = 50;

    for (let i = 0; i < numWords; i++) {
      let el = document.createElement("div");
      el.classList.add("word");

      // mot aléatoire
      el.textContent = words[Math.floor(Math.random() * words.length)*2];

      // position
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = Math.random() * 100 + "vh";

      // ✅ taille vraiment aléatoire (petit → grand)
      const size = Math.random() * 30 + 10; // 10px → 40px
      el.style.fontSize = size + "px";

      // opacité liée à la taille (plus grand = plus visible)
      el.style.color = `rgba(255,255,255,${size / 100})`;

      // durée
      el.style.animationDuration = (Math.random() * 10 + 1) + "s";

      // décalage négatif
      el.style.animationDelay = -(Math.random() * 100) + "s";

      document.body.appendChild(el);
    }