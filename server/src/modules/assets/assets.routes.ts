import { Router } from 'express';
import { getPrisma } from '../../db/client.js';

/**
 * `GET /assets/<picturePath>` — the client's `UserImage` component builds
 * `<img src="{api}/assets/{picturePath}">`. Uploaded avatars are stored as
 * data URIs on the user row (Render's disk is ephemeral); seed users have no
 * bytes, so a deterministic initials SVG is generated instead. Unknown paths
 * also answer with an avatar so no broken images ever render.
 */
export const assetsRouter = Router();

const palette = ['#834bff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const avatarSvg = (label: string): string => {
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  let hash = 0;
  for (const char of label) hash = (hash * 31 + char.charCodeAt(0)) % palette.length;
  const fill = palette[hash] ?? '#834bff';
  const text = initials || 'W';
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">',
    `<circle cx="60" cy="60" r="60" fill="${fill}"/>`,
    '<text x="60" y="60" fill="#ffffff" font-family="sans-serif" font-size="44"',
    ' font-weight="bold" text-anchor="middle" dominant-baseline="central">',
    text,
    '</text>',
    '</svg>',
  ].join('');
};

assetsRouter.get('/*', async (request, response) => {
  response.setHeader('Cache-Control', 'public, max-age=86400');
  try {
    const rawPath = decodeURIComponent(request.path.replace(/^\//, ''));
    if (rawPath) {
      const user = await getPrisma().user.findFirst({
        where: { picturePath: rawPath },
        select: { pictureData: true, firstName: true, lastName: true },
      });
      if (user) {
        if (user.pictureData?.startsWith('data:') && user.pictureData.includes(',')) {
          const header = user.pictureData.slice(0, user.pictureData.indexOf(','));
          const mime = header.slice(5, header.indexOf(';')) || 'image/png';
          const buffer = Buffer.from(user.pictureData.slice(user.pictureData.indexOf(',') + 1), 'base64');
          response.status(200).contentType(mime).send(buffer);
          return;
        }
        response
          .status(200)
          .contentType('image/svg+xml')
          .send(avatarSvg(`${user.firstName} ${user.lastName}`));
        return;
      }
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        service: 'warewise-api',
        event: 'asset_lookup_failed',
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
  response.status(200).contentType('image/svg+xml').send(avatarSvg('WareWise'));
});
