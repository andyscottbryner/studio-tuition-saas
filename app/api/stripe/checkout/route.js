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
  if (gymError || !gym) return NextResponse.json({ error: 'Gym not found.' }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: gym.stripe_customer_id ? undefined : user.email,
    customer: gym.stripe_customer_id || undefined,
    client_reference_id: gym.id,
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?checkout=success`,
    cancel_url: `${siteUrl}/billing?checkout=cancel`,
    metadata: { gym_id: gym.id },
    subscription_data: { metadata: { gym_id: gym.id } },
  });

  return NextResponse.json({ url: session.url });
}