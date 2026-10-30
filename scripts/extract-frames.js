const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

console.log('Using ffmpeg from:', ffmpegPath);

const outputDir = path.join(__dirname, '..', 'public', 'frames');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const inputVideo = path.join(__dirname, '..', 'scrub.mp4');
console.log('Input video:', inputVideo);

// Check if frames already exist
const existing = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
console.log(`Currently ${existing.length} frames in ${outputDir}`);

if (existing.length < 400) {
  console.log('Extracting 15 fps WebP frames (1280px wide for optimal web performance & instant load)...');
  const args = [
    '-i', inputVideo,
    '-vf', 'fps=15,scale=1280:-2',
    '-c:v', 'libwebp',
    '-quality', '68',
    '-compression_level', '4',
    path.join(outputDir, 'f_%04d.webp')
  ];

  const res = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
  if (res.error) {
    console.error('Extraction error:', res.error);
    process.exit(1);
  }
}

const finalFrames = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
console.log(`Success! Total frames extracted: ${finalFrames.length}`);

// Calculate total size
let totalBytes = 0;
for (const file of finalFrames) {
  totalBytes += fs.statSync(path.join(outputDir, file)).size;
}
console.log(`Total frame sequence size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Average frame size: ${(totalBytes / finalFrames.length / 1024).toFixed(1)} KB`);

