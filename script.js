const main = () => {
  const processedImages = [];

  const addInnerBorderToImage = (image, borderWidth, borderColor) => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    context.fillStyle = borderColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, borderWidth, borderWidth, image.width - 2 * borderWidth, image.height - 2 * borderWidth);

    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.strokeRect(borderWidth, borderWidth, image.width - 2 * borderWidth, image.height - 2 * borderWidth);

    const dataUrl = canvas.toDataURL();
    return dataUrl;
  };

  const addOuterBorderToImage = (image, borderWidth, borderColor) => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const canvasWidth = image.width + 2 * borderWidth;
    const canvasHeight = image.height + 2 * borderWidth;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.strokeRect(borderWidth / 2, borderWidth / 2, canvasWidth - borderWidth, canvasHeight - borderWidth);
    context.drawImage(image, borderWidth, borderWidth, image.width, image.height);

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
          let borderedImageUrl;
          if (borderType === 'inner') {
            borderedImageUrl = addInnerBorderToImage(image, borderWidth, borderColor);
          } else if (borderType === 'outer') {
            borderedImageUrl = addOuterBorderToImage(image, borderWidth, borderColor);
          }

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

  // Event listener for the form submission
  document.getElementById('options-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const borderWidth = parseInt(document.getElementById('border-width').value);
    const borderColor = document.getElementById('border-color').value;
    const borderType = document.getElementById('border-type').value;
    const files = document.getElementById('upload').files;

    processImages(files, borderWidth, borderColor, borderType);
  });

  // Event listener for the download button
  document.getElementById('download-button').addEventListener('click', () => {
    downloadImages();
  });
};

main();
