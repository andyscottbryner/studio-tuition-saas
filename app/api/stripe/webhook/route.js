import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

// Stripe needs the raw request body to verify the signature — do not
// parse it as JSON before this point.
export async function POST(req) {
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
        await supabaseAdmin
          .from('gyms')
          .update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            subscription_status: 'active',
          })
          .eq('id', gymId);
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const status = subscription.status; // active | trialing | past_due | canceled | unpaid ...
      await supabaseAdmin
        .from('gyms')
        .update({ subscription_status: status })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    default:
      // Ignore other event types.
      break;
  }

  return NextResponse.json({ received: true });
}
