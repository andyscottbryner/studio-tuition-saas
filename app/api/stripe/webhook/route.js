import { NextResponse } from 'next/server';
import { getStripe } from '../../../../lib/stripe';
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req) {
  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();

  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const gymId = session.client_reference_id || session.metadata?.gym_id;
      if (gymId) {
        let status = 'active';
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          status = sub.status;
        }
        await supabaseAdmin
          .from('gyms')
          .update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            subscription_status: status,
          })
          .eq('id', gymId);
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const status = subscription.status;
      await supabaseAdmin
        .from('gyms')
        .update({ subscription_status: status })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
