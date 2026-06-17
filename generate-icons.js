const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'assets', 'logo.svg');
const svg = fs.readFileSync(svgPath);

async function generate() {
  // App icon (1024x1024)
  await sharp(svg)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'icon.png'));
  console.log('Created icon.png (1024x1024)');

  // Splash icon (200x200 centered on transparent)
  await sharp(svg)
    .resize(200, 200)
    .png()
    .toFile(path.join(__dirname, 'assets', 'splash-icon.png'));
  console.log('Created splash-icon.png (200x200)');

  // Android adaptive icon foreground
  await sharp(svg)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, 'assets', 'android-icon-foreground.png'));
  console.log('Created android-icon-foreground.png (512x512)');

  // Favicon
  await sharp(svg)
    .resize(48, 48)
    .png()
    .toFile(path.join(__dirname, 'assets', 'favicon.png'));
  console.log('Created favicon.png (48x48)');
}

generate().catch(console.error);
