import type { APIRoute } from 'astro';

export const prerender = false;

interface GoogleReviewItem {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export const GET: APIRoute = async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || import.meta.env.GOOGLE_PLACES_API_KEY || '';
  const placeId = process.env.GOOGLE_PLACE_ID || import.meta.env.GOOGLE_PLACE_ID || '';
  const fallbackUrl = 'https://maps.google.com/?q=Ekansh+Homoeopathic+Clinic+Kankroli+Rajsamand';

  if (!apiKey || !placeId) {
    return new Response(
      JSON.stringify({
        configured: false,
        message: 'Google Places API credentials (GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID) are not configured in environment.',
        place_url: fallbackUrl,
        rating: 5.0,
        user_ratings_total: null,
        reviews: [],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,user_ratings_total,reviews,url&key=${encodeURIComponent(apiKey)}`;

    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      throw new Error(`Google Places API returned status ${apiRes.status}`);
    }

    const data = await apiRes.json();

    if (data.status !== 'OK' || !data.result) {
      console.warn('[Google Places API Warning]:', data.status, data.error_message);
      return new Response(
        JSON.stringify({
          configured: true,
          error: data.status,
          message: data.error_message || 'Could not retrieve reviews from Google Places API',
          place_url: fallbackUrl,
          rating: 5.0,
          reviews: [],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = data.result;
    const formattedReviews = (result.reviews || []).map((r: GoogleReviewItem) => ({
      author_name: r.author_name || 'Verified Patient',
      profile_photo_url: r.profile_photo_url || null,
      rating: r.rating || 5,
      relative_time: r.relative_time_description || 'Recently',
      text: r.text || '',
      time: r.time,
    }));

    return new Response(
      JSON.stringify({
        configured: true,
        name: result.name || 'Ekansh Homoeopathic Clinic',
        rating: result.rating || 5.0,
        user_ratings_total: result.user_ratings_total || formattedReviews.length,
        place_url: result.url || fallbackUrl,
        reviews: formattedReviews,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
        },
      }
    );
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    console.error('[Google Reviews API Error]:', errMessage);

    return new Response(
      JSON.stringify({
        configured: true,
        error: true,
        message: errMessage,
        place_url: fallbackUrl,
        rating: 5.0,
        reviews: [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
