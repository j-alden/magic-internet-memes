// Converts canvas to blob w/ broader browser support
import dataURLtoBlob from 'blueimp-canvas-to-blob';

// Download the edited image based on device type
const downloadEditedImage = (canvas, exportCanvas) => {
  if (exportCanvas) {
    prepExportCanvas(canvas, exportCanvas);

    // Prep blob to be downloaded
    const dataUrl = exportCanvas.toDataURL({ format: 'jpeg', quality: 0.9 });
    const blob = dataURLtoBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Open in new tab on mobile, download on desktop
    if (navigator.userAgent.match(/Tablet|iPad/i)) {
      a.target = '_blank';
      // do tablet stuff
    } else if (
      navigator.userAgent.match(
        /Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i
      )
    ) {
      a.target = '_blank';
      // do mobile stuff
    } else {
      a.download = 'meme.jpg';
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

// Scales objects from working canvas to exported canvas
const prepExportCanvas = (canvas, exportCanvas) => {
  const exportWidth = exportCanvas.width;
  const exportHeight = exportCanvas.height;

  let scaleX = exportWidth / canvas.width;
  let scaleY = exportHeight / canvas.height;

  let objects = canvas.getObjects();

  for (var i in objects) {
    let scaledObject = objects[i];
    scaledObject.scaleX = scaledObject.scaleX * scaleX;
    scaledObject.scaleY = scaledObject.scaleY * scaleY;
    scaledObject.left = scaledObject.left * scaleX;
    scaledObject.top = scaledObject.top * scaleY;
    //scaledObject.setCoords();

    exportCanvas.add(scaledObject);
  }
  exportCanvas.discardActiveObject();
  exportCanvas.renderAll();
  exportCanvas.calcOffset();
};

export default downloadEditedImage;
