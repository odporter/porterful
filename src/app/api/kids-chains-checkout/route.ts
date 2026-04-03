import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

type SizeKey = 'small' | 'medium' | 'large';
type FontKey = 'bold' | 'luxury' | 'script';

const PRICES: Record<SizeKey, number> = {
  small:  10_00,
  medium: 15_00,
  large:  20_00,
};

const SIZES: Record<SizeKey, { label: string; dims: string; desc: string }> = {
  small:  { label: 'Small',  dims: '~2"',  desc: 'Great for kids, lightweight' },
  medium: { label: 'Medium', dims: '~3"',  desc: 'Standard size, most popular' },
  large:  { label: 'Large',  dims: '~4"',  desc: 'Bold statement piece' },
};

const FONTS: Record<FontKey, { label: string; font: string; desc: string }> = {
  bold:   { label: 'Bold / Streetwear', font: 'Arial Black',       desc: 'Clean, chunky, street style' },
  luxury: { label: 'Luxury / Serif',    font: 'Georgia',            desc: 'Elegant, high-end feel' },
  script: { label: 'Script / Mono',     font: 'DejaVu Sans Mono',  desc: 'Connected cursive, industrial' },
};

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NCL-${ts}-${rnd}`;
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json() as unknown;
    const body = raw as { name?: string; size?: string; font?: string };

    const name  = (body.name  || '').trim();
    const size  = (body.size  || '') as SizeKey;
    const font  = (body.font  || '') as FontKey;

    if (!name || name.length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.length > 20) {
      return NextResponse.json({ error: 'Name must be 20 characters or less' }, { status: 400 });
    }
    if (!PRICES[size]) {
      return NextResponse.json({ error: 'Invalid size' }, { status: 400 });
    }
    if (!FONTS[font]) {
      return NextResponse.json({ error: 'Invalid font' }, { status: 400 });
    }

    const orderId   = generateOrderId();
    const price     = PRICES[size];
    const sizeLabel = SIZES[size].label;
    const fontLabel = FONTS[font].label;
    const fontName  = FONTS[font].font;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://porterful.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: `Custom 3D Name Chain — ${sizeLabel}`,
              description: `Name: ${name} | Font: ${fontLabel} | Size: ${sizeLabel} (${SIZES[size].dims})`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        name,
        size,
        font,
        fontName,
        type: 'kids-chains',
      },
      success_url: `${baseUrl}/kids-chains/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/kids-chains?cancelled=1`,
      payment_intent_data: {
        metadata: { orderId, type: 'kids-chains' },
      },
    });

    const orderData = {
      orderId,
      name,
      size,
      sizeLabel,
      font,
      fontLabel,
      fontName,
      price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      checkoutUrl: session.url,
    };

    const ordersDir = path.join(process.cwd(), 'data', 'orders');
    await mkdir(ordersDir, { recursive: true });
    await writeFile(path.join(ordersDir, `${orderId}.json`), JSON.stringify(orderData, null, 2));

    return NextResponse.json({ url: session.url, orderId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/kids-chains-checkout]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
