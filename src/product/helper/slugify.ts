export default function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD') // split accented chars
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // spaces → dashes
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-|-$/g, ''); // trim dashes
}
