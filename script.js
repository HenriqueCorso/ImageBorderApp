const main = () => {
  const processedImages = [];

  const addBorderToImage = (image, borderWidth, borderColor, borderType) => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const canvasWidth = image.width + 2 * borderWidth;
    const canvasHeight = image.height + 2 * borderWidth;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (borderType === 'outer') {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.strokeRect(borderWidth / 2, borderWidth / 2, canvasWidth - borderWidth, canvasHeight - borderWidth);
    } else if (borderType === 'inner') {
      context.fillStyle = borderColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    context.drawImage(image, borderWidth, borderWidth, image.width, image.height);

    if (borderType === 'inner') {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.strokeRect(borderWidth, borderWidth, image.width, image.height);
    }

    const dataUrl = canvas.toDataURL();
    return dataUrl;
  };

  const processImages = (files, borderWidth, borderColor, borderType) => {
    const previewDiv = document.getElementById('preview');
    previewDiv.innerHTML = '';

    processedImages.length = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = () => {
          const borderedImageUrl = addBorderToImage(
            image,
            borderWidth,
            borderColor,
            borderType
          );

          const borderedImage = new Image();
          borderedImage.src = borderedImageUrl;
          borderedImage.className = 'preview-image';

          borderedImage.addEventListener('click', () => {
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(borderedImage, 0, 0, canvas.width, canvas.height);
          });

          previewDiv.appendChild(borderedImage);
          processedImages.push(borderedImageUrl);

          updateDownloadButton();
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const updateDownloadButton = () => {
    const downloadButton = document.getElementById('download-button');
    if (processedImages.length > 0) {
      downloadButton.removeAttribute('disabled');
    } else {
      downloadButton.setAttribute('disabled', 'disabled');
    }
  };

  const downloadImages = () => {
    if (processedImages.length === 0) {
      return;
    }

    const zip = new JSZip();

    processedImages.forEach((imageUrl, index) => {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(`image_${index + 1}.png`, blob);
          if (index === processedImages.length - 1) {
            zip.generateAsync({ type: 'blob' }).then((content) => {
              saveAs(content, 'processed_images.zip');
            });
          }
        });
    });
  };

  document.getElementById('options-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const borderWidth = parseInt(document.getElementById('border-width').value);
    const borderColor = document.getElementById('border-color').value;
    const borderType = document.getElementById('border-type').value;
    const files = document.getElementById('upload').files;

    processImages(files, borderWidth, borderColor, borderType);
  });

  document.getElementById('download-button').addEventListener('click', () => {
    downloadImages();
  });
};

main();
