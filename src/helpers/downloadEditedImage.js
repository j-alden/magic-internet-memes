// Converts canvas to blob w/ broader browser support
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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

    // Trying to upload
    uploadImageToBlob(blob);

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

const saveTempImage = async (canvas, exportCanvas) => {
  if (exportCanvas) {
    prepExportCanvas(canvas, exportCanvas);

    // Prep blob to be stored
    const dataUrl = exportCanvas.toDataURL({ format: 'jpeg', quality: 0.9 });
    const blob = dataURLtoBlob(dataUrl);
    //const url = URL.createObjectURL(blob);
    return blob;
  }
};

const uploadImageToBlob = async (imageBlob) => {
  const formData = new FormData();
  formData.append('file', imageBlob, 'edited-image.png');

  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/upload-meme`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error('Error uploading image to blob storage', error);
    throw error;
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

export default saveTempImage;
