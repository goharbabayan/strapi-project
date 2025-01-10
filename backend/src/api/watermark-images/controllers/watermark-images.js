const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = {
  async apply(ctx) {
    const { files } = ctx.request;

    if (!files || (!files.image && !files.images)) {
      return ctx.badRequest('At least one image file is required');
    }

    const watermarkImagePath = path.join(__dirname, '..', 'watermark_transparent.png');

    if (!fs.existsSync(watermarkImagePath)) {
      return ctx.badRequest('Watermark image not found.');
    }

    try {
      const imagesArray = Array.isArray(files.images) ? files.images : [files.images];

      const watermarkedImages = [];

      for (let i = 0; i < imagesArray.length; i++) {
        const imageFile = imagesArray[i];

        const { path: tempPath, name } = imageFile;
        const imageBuffer = fs.readFileSync(tempPath);
        const baseImageMetadata = await sharp(imageBuffer).metadata();

        const watermarkResized = await sharp(watermarkImagePath)
          .resize({
            width: Math.floor(baseImageMetadata.width * 0.8),
            height: null,
          })
          .toBuffer();

        const watermarkedImage = await sharp(imageBuffer)
          .composite([
            {
              input: watermarkResized,
              gravity: 'center',
              blend: 'over',
            },
          ])
          .toBuffer();

        const tmpFolderPath = path.join(__dirname, '..', 'tmp');
        if (!fs.existsSync(tmpFolderPath)) {
          fs.mkdirSync(tmpFolderPath, { recursive: true });
        }

        const tempFilePath = path.join(tmpFolderPath, `${name}_watermarked.png`);

        await sharp(watermarkedImage).toFile(tempFilePath);

        const uploadService = strapi.plugins['upload'].services.upload;
        const uploadedFile = await uploadService.upload({
          data: { folder: 'API Uploads' },
          files: {
            path: tempFilePath,
            name: `${name}_watermarked.png`,
            type: 'image/png',
          },
        });

        watermarkedImages.push({ url: uploadedFile[0].url });
        await fs.promises.unlink(tempFilePath);
      }

      ctx.body = {
        message: 'Watermarks applied and images uploaded successfully',
        watermarkedImages: watermarkedImages,
      };

    } catch (error) {
      console.error('Error applying watermark:', error);
      ctx.throw(500, `Failed to apply watermark: ${error.message}`);
    }
  },
};
