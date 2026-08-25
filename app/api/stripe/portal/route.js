import { NextResponse } from 'next/server';
import { getStripe } from '../../../../lib/stripe';
import { supabaseForToken } from '../../../../lib/supabaseForToken';

export async function POST(req) {
  const stripe = getStripe();
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { gymId } = await req.json();
  const db = supabaseForToken(token);

  const { data: { user }, error: userError } = await db.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { data: gym, error: gymError } = await db.from('gyms').select('*').eq('id', gymId).single();
  if (gymError || !gym || !gym.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account on file yet.' }, { status: 404 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: gym.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}