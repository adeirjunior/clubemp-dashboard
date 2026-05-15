const CARD_WIDTH = 1400;
const CARD_HEIGHT = 900;
const SPARK_COUNT = 72;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

class ClubempCard extends HTMLElement {
  static get observedAttributes() {
    return [
      "name",
      "nome",
      "type",
      "tipo",
      "card-code",
      "cardcode",
      "codigo",
      "site",
      "link",
      "logo",
      "logo-src",
      "qrcode",
      "qr-code",
    ];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 1120px;
          aspect-ratio: 14 / 9;
        }

        canvas {
          display: block;
          width: 100%;
          height: auto;
          border-radius: clamp(16px, 2.5vw, 28px);
          box-shadow:
            0 28px 80px rgba(0, 0, 0, 0.28),
            0 6px 18px rgba(0, 0, 0, 0.18);
        }
      </style>
      <canvas width="${CARD_WIDTH}" height="${CARD_HEIGHT}" part="canvas"></canvas>
    `;

    this.canvas = this.shadowRoot.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sparks = [];
    this.animationFrame = null;
    this.logoImage = null;
    this.logoImageSource = "";
    this.qrImage = null;
    this.qrImageSource = "";
  }

  connectedCallback() {
    this.initSparks();
    this.loadLogoImage();
    this.loadQrImage();
    this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "logo" || name === "logo-src") {
      this.loadLogoImage();
    }

    if (name === "qrcode" || name === "qr-code") {
      this.loadQrImage();
    }

    this.draw(performance.now());
  }

  get cardName() {
    return (
      this.getAttribute("nome") ||
      this.getAttribute("name") ||
      "Membro Clubemp"
    );
  }

  get cardType() {
    return (
      this.getAttribute("tipo") ||
      this.getAttribute("type") ||
      "Cliente Associado"
    );
  }

  get cardTypeLabel() {
    const normalized = this.cardType.trim().toLowerCase();
    const labels = {
      "socio empreendedor": "SÓCIO EMPREENDEDOR",
      "sócio empreendedor": "SÓCIO EMPREENDEDOR",
      empreendedor: "SÓCIO EMPREENDEDOR",
      "socio conveniado": "SÓCIO CONVENIADO",
      "sócio conveniado": "SÓCIO CONVENIADO",
      conveniado: "SÓCIO CONVENIADO",
      "cliente vinculado": "CLIENTE VINCULADO",
      "cliente associado": "CLIENTE ASSOCIADO",
      cliente_associado: "CLIENTE ASSOCIADO",
      cliente: "CLIENTE ASSOCIADO",
    };

    return labels[normalized] || this.cardType.toUpperCase();
  }

  get cardCode() {
    return (
      this.getAttribute("card-code") ||
      this.getAttribute("cardcode") ||
      this.getAttribute("codigo") ||
      "CLI-000000"
    );
  }

  get siteUrl() {
    return (
      this.getAttribute("link") ||
      this.getAttribute("site") ||
      "www.clubemp.valeriawaz.com.br"
    );
  }

  get logoUrl() {
    return (
      this.getAttribute("logo-src") ||
      this.getAttribute("logo") ||
      "/assets/img/app-icon.png"
    );
  }

  get qrCodeUrl() {
    return this.getAttribute("qr-code") || this.getAttribute("qrcode") || "";
  }

  start() {
    this.stop();

    const render = (time = 0) => {
      this.draw(time);
      this.animationFrame = requestAnimationFrame(render);
    };

    this.animationFrame = requestAnimationFrame(render);
  }

  stop() {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  loadLogoImage() {
    const source = this.logoUrl.trim();
    if (source === "" || source === this.logoImageSource) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      this.logoImage = image;
      this.logoImageSource = source;
      this.draw(performance.now());
    };
    image.onerror = () => {
      this.logoImage = null;
      this.logoImageSource = "";
      this.draw(performance.now());
    };
    image.src = source;
  }

  loadQrImage() {
    const source = this.qrCodeUrl.trim();
    if (source === "" || source === this.qrImageSource) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      this.qrImage = image;
      this.qrImageSource = source;
      this.draw(performance.now());
    };
    image.onerror = () => {
      this.qrImage = null;
      this.qrImageSource = "";
      this.draw(performance.now());
    };
    image.src = source;
  }

  roundRect(x, y, w, h, r) {
    const ctx = this.ctx;
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  fillRoundRect(x, y, w, h, r, fillStyle) {
    this.ctx.save();
    this.roundRect(x, y, w, h, r);
    this.ctx.fillStyle = fillStyle;
    this.ctx.fill();
    this.ctx.restore();
  }

  strokeRoundRect(x, y, w, h, r, strokeStyle, lineWidth = 2) {
    this.ctx.save();
    this.roundRect(x, y, w, h, r);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.restore();
  }

  goldGradient(x1, y1, x2, y2) {
    const g = this.ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, "#5e3400");
    g.addColorStop(0.12, "#9f6404");
    g.addColorStop(0.28, "#e3b542");
    g.addColorStop(0.42, "#fff0ad");
    g.addColorStop(0.56, "#f0c44f");
    g.addColorStop(0.75, "#b37008");
    g.addColorStop(1, "#5b3100");
    return g;
  }

  softGoldGradient(x1, y1, x2, y2) {
    const g = this.ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, "#b07a12");
    g.addColorStop(0.5, "#ffe18a");
    g.addColorStop(1, "#8a5708");
    return g;
  }

  deepPanelGradient(x, y, w, h) {
    const g = this.ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "rgba(8, 4, 2, .96)");
    g.addColorStop(0.26, "rgba(45, 20, 7, .94)");
    g.addColorStop(0.52, "rgba(12, 7, 4, .97)");
    g.addColorStop(0.78, "rgba(62, 30, 8, .92)");
    g.addColorStop(1, "rgba(5, 3, 2, .98)");
    return g;
  }

  darkLuxuryBg() {
    const g = this.ctx.createRadialGradient(
      CARD_WIDTH * 0.5,
      CARD_HEIGHT * 0.35,
      40,
      CARD_WIDTH * 0.5,
      CARD_HEIGHT * 0.45,
      1200,
    );
    g.addColorStop(0, "#8a4b16");
    g.addColorStop(0.1, "#3c1a0c");
    g.addColorStop(0.34, "#070707");
    g.addColorStop(0.72, "#010101");
    g.addColorStop(1, "#1b0b03");
    return g;
  }

  goldText(text, x, y, font, align = "center", shadow = true) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillStyle = "#fff4bd";
    if (shadow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255,205,80,.35)";
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  lightText(text, x, y, font, align = "center", alpha = 1) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillStyle = `rgba(255,246,218,${alpha})`;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawNoiseTexture() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.075;
    for (let i = 0; i < 850; i += 1) {
      const x = Math.random() * CARD_WIDTH;
      const y = Math.random() * CARD_HEIGHT;
      const isGold = Math.random() > 0.25;
      ctx.fillStyle = isGold
        ? "rgba(255,188,45,.42)"
        : "rgba(255,255,255,.18)";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();
  }

  drawPremiumSheen() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const g = ctx.createLinearGradient(70, 110, 1060, 680);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.22, "rgba(255,215,95,.10)");
    g.addColorStop(0.32, "rgba(255,245,180,.18)");
    g.addColorStop(0.42, "rgba(255,215,95,.06)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    this.roundRect(58, 58, CARD_WIDTH - 116, CARD_HEIGHT - 116, 22);
    ctx.fill();
    ctx.restore();
  }

  drawSpark(x, y, size = 3, alpha = 1) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(x, y, 0, x, y, size * 6);
    g.addColorStop(0, "rgba(255,248,220,1)");
    g.addColorStop(0.2, "rgba(255,228,130,.95)");
    g.addColorStop(0.42, "rgba(255,195,70,.65)");
    g.addColorStop(1, "rgba(255,170,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, size * 5.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(255,235,185,${alpha * 0.35})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - size * 1.7, y);
    ctx.lineTo(x + size * 1.7, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - size * 1.7);
    ctx.lineTo(x, y + size * 1.7);
    ctx.stroke();
    ctx.restore();
  }

  isSparkZone(x, y) {
    const inLeftGlow = x < CARD_WIDTH * 0.34 && y > CARD_HEIGHT * 0.17;
    const inRightGlow = x > CARD_WIDTH * 0.72 && y > CARD_HEIGHT * 0.1;
    return inLeftGlow || inRightGlow;
  }

  createSpark(side = null) {
    const useLeft = side ? side === "left" : Math.random() > 0.5;
    const x = useLeft
      ? randomBetween(35, CARD_WIDTH * 0.31)
      : randomBetween(CARD_WIDTH * 0.74, CARD_WIDTH - 65);
    const y = useLeft
      ? randomBetween(CARD_HEIGHT * 0.18, CARD_HEIGHT - 45)
      : randomBetween(CARD_HEIGHT * 0.13, CARD_HEIGHT * 0.8);
    return {
      baseX: x,
      baseY: y,
      x,
      y,
      size: randomBetween(1.1, 3.2),
      alpha: randomBetween(0.2, 0.92),
      alphaMin: randomBetween(0.15, 0.3),
      alphaMax: randomBetween(0.55, 0.95),
      twinkleSpeed: randomBetween(0.006, 0.022),
      twinkleOffset: randomBetween(0, Math.PI * 2),
      driftX: randomBetween(-0.14, 0.14),
      driftY: randomBetween(-0.05, 0.05),
      swayAmplitude: randomBetween(4, 14),
      swaySpeed: randomBetween(0.002, 0.01),
      swayOffset: randomBetween(0, Math.PI * 2),
      life: randomBetween(360, 1100),
      age: 0,
      side: useLeft ? "left" : "right",
    };
  }

  initSparks() {
    this.sparks = Array.from({ length: SPARK_COUNT }, (_, index) =>
      this.createSpark(index % 2 === 0 ? "left" : "right"),
    );
  }

  updateSparks(time) {
    this.sparks = this.sparks.map((spark) => {
      const next = spark;
      next.age += 1;
      next.baseX += next.driftX;
      next.baseY += next.driftY;
      const swayX =
        Math.sin(time * next.swaySpeed + next.swayOffset) * next.swayAmplitude;
      const swayY =
        Math.cos(time * (next.swaySpeed * 0.65) + next.swayOffset) *
        (next.swayAmplitude * 0.22);
      const pulse =
        (Math.sin(time * next.twinkleSpeed + next.twinkleOffset) + 1) / 2;
      next.x = next.baseX + swayX;
      next.y = next.baseY + swayY;
      next.alpha = next.alphaMin + pulse * (next.alphaMax - next.alphaMin);
      const outOfBounds =
        next.x < -20 ||
        next.x > CARD_WIDTH + 20 ||
        next.y < -20 ||
        next.y > CARD_HEIGHT + 20 ||
        !this.isSparkZone(next.x, next.y) ||
        next.age > next.life;
      return outOfBounds ? this.createSpark(next.side) : next;
    });
  }

  fitText(text, maxWidth, baseSize = 42, minSize = 20, family = "Georgia") {
    let size = baseSize;
    do {
      this.ctx.font = `700 ${size}px ${family}`;
      size -= 1;
    } while (this.ctx.measureText(text).width > maxWidth && size > minSize);
    return size + 1;
  }

  drawFrame() {
    const ctx = this.ctx;
    this.fillRoundRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40, 34, this.darkLuxuryBg());

    const goldenDust = ctx.createRadialGradient(
      CARD_WIDTH * 0.44,
      CARD_HEIGHT * 0.35,
      30,
      CARD_WIDTH * 0.5,
      CARD_HEIGHT * 0.45,
      860,
    );
    goldenDust.addColorStop(0, "rgba(179,98,23,.23)");
    goldenDust.addColorStop(0.38, "rgba(80,38,10,.18)");
    goldenDust.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = goldenDust;
    this.roundRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40, 34);
    ctx.fill();

    const leftGlow = ctx.createRadialGradient(150, 670, 8, 210, 650, 390);
    leftGlow.addColorStop(0, "rgba(255,229,118,.78)");
    leftGlow.addColorStop(0.16, "rgba(255,187,31,.34)");
    leftGlow.addColorStop(1, "rgba(255,175,20,0)");
    ctx.fillStyle = leftGlow;
    this.roundRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40, 34);
    ctx.fill();

    const vignette = ctx.createRadialGradient(
      CARD_WIDTH * 0.52,
      CARD_HEIGHT * 0.44,
      180,
      CARD_WIDTH * 0.5,
      CARD_HEIGHT * 0.5,
      930,
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.74, "rgba(0,0,0,.34)");
    vignette.addColorStop(1, "rgba(0,0,0,.74)");
    ctx.fillStyle = vignette;
    this.roundRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40, 34);
    ctx.fill();

    this.strokeRoundRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40, 34, this.goldGradient(0, 0, CARD_WIDTH, CARD_HEIGHT), 8);
    this.strokeRoundRect(31, 31, CARD_WIDTH - 62, CARD_HEIGHT - 62, 30, "rgba(255,231,150,.78)", 1.6);
    this.strokeRoundRect(45, 45, CARD_WIDTH - 90, CARD_HEIGHT - 90, 25, this.goldGradient(30, 30, CARD_WIDTH - 30, CARD_HEIGHT - 30), 2.6);
    this.strokeRoundRect(59, 59, CARD_WIDTH - 118, CARD_HEIGHT - 118, 20, "rgba(255,210,105,.22)", 1);

    this.drawNoiseTexture();
    this.drawPremiumSheen();
  }

  drawBackgroundTexture() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.09;
    for (let i = 0; i < 18; i += 1) {
      const gx = randomBetween(180, CARD_WIDTH - 220);
      const gy = randomBetween(120, CARD_HEIGHT - 110);
      const gw = randomBetween(180, 420);
      const gh = randomBetween(70, 180);
      const grad = ctx.createRadialGradient(gx, gy, 10, gx, gy, gw);
      grad.addColorStop(0, "rgba(255,180,110,.22)");
      grad.addColorStop(1, "rgba(255,180,110,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(gx, gy, gw, gh, randomBetween(-0.7, 0.7), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawCurvedGoldCorner() {
    const ctx = this.ctx;
    const path = new Path2D();
    ctx.save();
    path.moveTo(42, CARD_HEIGHT - 42);
    path.lineTo(42, CARD_HEIGHT * 0.5);
    path.bezierCurveTo(56, CARD_HEIGHT * 0.61, 136, CARD_HEIGHT * 0.75, 238, CARD_HEIGHT - 42);
    path.closePath();
    const g = ctx.createLinearGradient(42, CARD_HEIGHT * 0.55, 270, CARD_HEIGHT - 18);
    g.addColorStop(0, "#6d3900");
    g.addColorStop(0.15, "#bd871f");
    g.addColorStop(0.4, "#ffe37f");
    g.addColorStop(0.72, "#d29211");
    g.addColorStop(1, "#704000");
    ctx.fillStyle = g;
    ctx.fill(path);
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.goldGradient(42, CARD_HEIGHT * 0.6, 270, CARD_HEIGHT - 28);
    ctx.stroke(path);
    ctx.restore();
  }

  drawTopTitleContrast() {
    const ctx = this.ctx;
    const x = 275;
    const y = 78;
    const w = 760;
    const h = 178;
    ctx.save();
    const g = ctx.createLinearGradient(x, y, x + w, y);
    g.addColorStop(0, "rgba(0, 0, 0, .82)");
    g.addColorStop(0.42, "rgba(0, 0, 0, .58)");
    g.addColorStop(0.72, "rgba(0, 0, 0, .24)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    this.roundRect(x, y, w, h, 18);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  drawTopOrnaments() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.goldGradient(0, 0, CARD_WIDTH, 0);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 158);
    ctx.lineTo(980, 158);
    ctx.stroke();
    ctx.fillStyle = "#f5dc84";
    ctx.beginPath();
    ctx.arc(300, 158, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawLogoImage() {
    const ctx = this.ctx;
    const x = 56;
    const y = 73;
    const size = 220;
    const cx = x + size / 2;
    const cy = y + size / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.clip();
    if (this.logoImage instanceof HTMLImageElement && this.logoImage.complete) {
      ctx.drawImage(this.logoImage, x, y, size, size);
    } else {
      ctx.fillStyle = this.deepPanelGradient(x, y, size, size);
      ctx.fillRect(x, y, size, size);
      this.goldText("CLUBEMP", cx, cy + 10, "700 28px Georgia");
    }
    ctx.restore();
  }

  drawNamePlate() {
    const ctx = this.ctx;
    const x = 190;
    const y = 386;
    const w = 995;
    const h = 138;
    const outerGlow = ctx.createRadialGradient(CARD_WIDTH / 2, y + h / 2, 10, CARD_WIDTH / 2, y + h / 2, 560);
    outerGlow.addColorStop(0, "rgba(255,185,38,.16)");
    outerGlow.addColorStop(1, "rgba(255,190,30,0)");
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.ellipse(CARD_WIDTH / 2, y + h / 2, 590, 95, 0, 0, Math.PI * 2);
    ctx.fill();

    this.fillRoundRect(x, y, w, h, 18, this.deepPanelGradient(x, y, w, h));
    const topLight = ctx.createLinearGradient(x, y, x, y + h);
    topLight.addColorStop(0, "rgba(255,221,112,.20)");
    topLight.addColorStop(0.38, "rgba(255,221,112,.05)");
    topLight.addColorStop(1, "rgba(0,0,0,.28)");
    this.fillRoundRect(x + 8, y + 8, w - 16, h - 16, 14, topLight);
    this.strokeRoundRect(x, y, w, h, 18, this.goldGradient(x, y, x + w, y + h), 4);
    this.strokeRoundRect(x + 10, y + 10, w - 20, h - 20, 13, "rgba(255,220,130,.30)", 1);

    const nameSize = this.fitText(this.cardName, 860, 43, 24);
    this.lightText(this.cardName, CARD_WIDTH / 2, 470, `700 ${nameSize}px Georgia`, "center", 0.98);
  }

  drawCodePlate() {
    const ctx = this.ctx;
    const x = 355;
    const y = 554;
    const w = 690;
    const h = 138;

    this.fillRoundRect(x, y, w, h, 20, this.deepPanelGradient(x, y, w, h));
    const softGold = ctx.createLinearGradient(x, y, x + w, y + h);
    softGold.addColorStop(0, "rgba(255,220,110,.16)");
    softGold.addColorStop(0.45, "rgba(0,0,0,.10)");
    softGold.addColorStop(1, "rgba(255,195,55,.12)");
    this.fillRoundRect(x + 8, y + 8, w - 16, h - 16, 15, softGold);
    this.strokeRoundRect(x, y, w, h, 20, this.goldGradient(x, y, x + w, y + h), 4);
    this.strokeRoundRect(x + 11, y + 11, w - 22, h - 22, 15, "rgba(255,219,124,.26)", 1.2);

    this.goldText(this.cardTypeLabel, CARD_WIDTH / 2, 617, "700 38px Georgia");

    const codeBadgeX = CARD_WIDTH / 2 - 155;
    const codeBadgeY = 637;
    const codeBadgeW = 310;
    const codeBadgeH = 38;
    const codeBadge = ctx.createLinearGradient(codeBadgeX, codeBadgeY, codeBadgeX, codeBadgeY + codeBadgeH);
    codeBadge.addColorStop(0, "#f8d978");
    codeBadge.addColorStop(0.48, "#fff0ad");
    codeBadge.addColorStop(1, "#b9790c");
    this.fillRoundRect(codeBadgeX, codeBadgeY, codeBadgeW, codeBadgeH, 8, codeBadge);

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#111";
    ctx.font = "900 27px Arial";
    ctx.fillText(this.cardCode.toUpperCase(), CARD_WIDTH / 2, 665);
    ctx.restore();
  }

  drawQRCode() {
    const ctx = this.ctx;
    const x = 1132;
    const y = 88;
    const s = 175;

    ctx.save();
    this.strokeRoundRect(x - 12, y - 12, s + 24, s + 24, 12, this.goldGradient(x, y, x + s, y + s), 4);
    this.fillRoundRect(x, y, s, s, 7, "#fff8df");
    this.strokeRoundRect(x + 8, y + 8, s - 16, s - 16, 5, "rgba(80,45,5,.35)", 1.2);

    if (this.qrImage instanceof HTMLImageElement && this.qrImage.complete) {
      ctx.drawImage(this.qrImage, x + 10, y + 10, s - 20, s - 20);
    } else {
      ctx.strokeStyle = "rgba(40, 25, 5, .45)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x + 24, y + 24);
      ctx.lineTo(x + s - 24, y + s - 24);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + s - 24, y + 24);
      ctx.lineTo(x + 24, y + s - 24);
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = "700 22px Arial";
      ctx.textAlign = "center";
      ctx.fillText("QR CODE", x + s / 2, y + s / 2 + 8);
    }

    ctx.restore();
  }

  drawTexts() {
    const ctx = this.ctx;
    ctx.save();
    const textX = 300;
    this.goldText("CLUBEMP", textX, 145, "700 62px Georgia", "left");
    this.lightText("ECOSSISTEMA ESTRATÉGICO", textX, 196, "700 25px Georgia", "left", 0.96);
    ctx.textAlign = "left";
    ctx.fillStyle = "#f0c85c";
    ctx.font = "700 22px Georgia";
    ctx.fillText("NEGÓCIOS • PARCERIAS • VANTAGENS", textX, 224, 760);
    this.lightText(this.siteUrl, CARD_WIDTH / 2, 786, "700 38px Arial", "center", 0.96);
    ctx.restore();
  }

  drawBottomDetail() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.softGoldGradient(0, 0, CARD_WIDTH, 0);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(450, 727);
    ctx.lineTo(960, 727);
    ctx.stroke();
    ctx.fillStyle = "#f0d275";
    ctx.beginPath();
    ctx.arc(705, 727, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawCenterGlow() {
    const ctx = this.ctx;
    const g = ctx.createRadialGradient(CARD_WIDTH / 2, 540, 8, CARD_WIDTH / 2, 540, 78);
    g.addColorStop(0, "rgba(255,220,92,.95)");
    g.addColorStop(0.28, "rgba(255,185,35,.38)");
    g.addColorStop(1, "rgba(255,160,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(CARD_WIDTH / 2, 540, 78, 0, Math.PI * 2);
    ctx.fill();
  }

  drawAnimatedSparks() {
    this.sparks.forEach((spark) => {
      this.drawSpark(spark.x, spark.y, spark.size, spark.alpha);
    });
  }

  draw(time = 0) {
    this.ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    this.updateSparks(time);
    this.drawFrame();
    this.drawBackgroundTexture();
    this.drawAnimatedSparks();
    this.drawCurvedGoldCorner();
    this.drawLogoImage();
    this.drawTopTitleContrast();
    this.drawTopOrnaments();
    this.drawTexts();
    this.drawNamePlate();
    this.drawCenterGlow();
    this.drawCodePlate();
    this.drawBottomDetail();
    this.drawQRCode();
  }
}

if (!customElements.get("clubemp-card")) {
  customElements.define("clubemp-card", ClubempCard);
}
