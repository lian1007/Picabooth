const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const snapButton = document.getElementById('snap');
const resetButton = document.getElementById('reset');
const previewRow = document.getElementById('previewRow');
const collageCanvas = document.getElementById('collage');
const collageImg = document.getElementById('collageImg');
const FinalIm = document.getElementById('finalImg');

const capturedImages = [];

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

snapButton.addEventListener('click', () => {
  if (capturedImages.length >= 4) {
    alert('你已經拍滿四張囉！');
    return;
  }
  takePhoto();
});

function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  // ✅ 鏡像反轉
  context.save();
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.restore();

  const imgData = canvas.toDataURL('image/png');
  capturedImages.push(imgData);

  const img = document.createElement('img');
  img.src = imgData;
  previewRow.appendChild(img);

  if (capturedImages.length === 4) {
    generateCollage();
    video.style.display = 'none';
    previewRow.style.display = 'none';
    collageImg.style.display = 'block';
    // collageCanvas.style.display = 'block';
  }
}

function generateCollage() {
  const ctx = collageCanvas.getContext('2d');
  const imgHeight = 240;
  const imgWidth = 320;
  const padding = 20;
  const totalHeight = 4 * imgHeight + 5 * padding + 60;

  collageCanvas.width = imgWidth + padding * 2;
  collageCanvas.height = totalHeight;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, collageCanvas.width, collageCanvas.height);

  const loadImages = capturedImages.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  });

  Promise.all(loadImages).then((images) => {
    images.forEach((img, i) => {
      const top = padding + i * (imgHeight + padding);
      ctx.drawImage(img, padding, top, imgWidth, imgHeight);
    });

    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    const now = new Date();
    const timeStr =
      now.toLocaleDateString() +
      '  ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ctx.fillText('Picapica  ' + timeStr, 60, collageCanvas.height - 35);
    ctx.fillStyle = '#888';
    ctx.font = '12px sans-serif';
    ctx.fillText(
      '© 2025 AW',
      collageCanvas.width - 100,
      collageCanvas.height - 18
    );

    collageImg.src = collageCanvas.toDataURL('image/png');
  });
}

resetButton.addEventListener('click', () => {
  capturedImages.length = 0;
  previewRow.innerHTML = '';
  collageImg.src = '';
  // collageCanvas.style.display = 'none';
  previewRow.style.display = 'block';
  collageImg.style.display = 'none';
  video.style.display = 'block';
});
