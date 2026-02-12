// scripts/backfillPublicId.ts

import { prisma } from '../config/prisma';

// const extractPublicId = (url: string): string | null => {
//   const uploadIndex = url.indexOf('/upload/');
//   if (uploadIndex === -1) return null;

//   let path = url.substring(uploadIndex + 8);

//   const versionIndex = path.indexOf('/v');
//   if (versionIndex !== -1) {
//     path = path.substring(versionIndex + 1);
//   }

//   path = path.replace(/^v\d+\//, '');
//   return path.replace(/\.[^/.]+$/, '');
// };

async function main() {
  const images = await prisma.productImage.findMany({
    where: { publicId: null },
  });

  // for (const img of images) {
  //   const publicId = extractPublicId(img.imageUrl);
  //   if (!publicId) continue;

  //   await prisma.productImage.update({
  //     where: { id: img.id },
  //     data: { publicId },
  //   });
  // }

  console.log('✅ publicId backfill completed', images);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
