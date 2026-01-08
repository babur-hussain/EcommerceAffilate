import { Router, Request, Response } from 'express';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import cloudinary from '../config/cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// POST /api/upload/images - Upload multiple images to Cloudinary
router.post('/upload/images', verifyFirebaseToken, upload.array('images', 7), async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    });

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((result: any) => result.secure_url);

    console.log(`✅ Uploaded ${imageUrls.length} images for user ${authUser.id}`);

    res.json({ 
      success: true, 
      images: imageUrls,
      count: imageUrls.length 
    });
  } catch (error: any) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload images', message: error.message });
  }
});

// POST /api/upload/image - Upload single image to Cloudinary
router.post('/upload/image', verifyFirebaseToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'image',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    console.log(`✅ Uploaded single image for user ${authUser.id}`);

    res.json({ 
      success: true, 
      imageUrl: (result as any).secure_url 
    });
  } catch (error: any) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

export default router;
