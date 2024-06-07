import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function upload(request) {
  const form = await request.formData();
  const file = form.get('file');
  const filePath = `temp-memes/${file.name}.jpg`;
  const blob = await put(filePath, file, { access: 'public' });

  return Response.json(blob);
}
