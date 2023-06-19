const main = () => {
  const addBorderToImage = (image, borderWidth, borderColor, borderType) => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 1000 * (image.height / image.width);;
    canvas.height = 1000 * (image.height / image.width);

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (borderType === 'outer') {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.strokeRect(0, 0, canvas.width, canvas.height);
    } else if (borderType === 'inner') {
      context.fillStyle = borderColor;
      context.fillRect(0, 0, canvas.width, borderWidth);
      context.fillRect(0, 0, borderWidth, canvas.height);
      context.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth);
      context.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height);
    }

    const dataUrl = canvas.toDataURL();
    return dataUrl;
  };

  const processImages = (files, borderWidth, borderColor, borderType) => {
    const previewDiv = document.getElementById('preview');
    previewDiv.innerHTML = '';

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
        };
      };

      reader.readAsDataURL(file);
    }
  };

  document.getElementById('options-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const borderWidth = parseInt(document.getElementById('border-width').value);
    const borderColor = document.getElementById('border-color').value;
    const borderType = document.getElementById('border-type').value;
    const files = document.getElementById('upload').files;

    processImages(files, borderWidth, borderColor, borderType);
  });
};

main();

