"use client";

import React, { useState } from "react";
import { BookOpen, Copy, CheckCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TABS = [
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Flutter",
] as const;
type Tab = (typeof TABS)[number];

const CODE: Record<Tab, string> = {
  JavaScript: `<!-- Include the Uverus inline script -->
<script src="https://js.uverus.com/v1/inline.js"></script>

<button id="pay-btn">Pay Now</button>

<script>
  document.getElementById('pay-btn').onclick = function () {
    UverusPay({
      key: 'pk_test_YOUR_PUBLIC_KEY',
      email: 'customer@example.com',
      amount: 500000, // in kobo
      currency: 'NGN',
      ref: 'unique-ref-' + Date.now(),
      callback: function (response) {
        console.log('Payment complete:', response.reference);
        // Verify on your backend
      },
      onClose: function () {
        console.log('Payment dialog closed');
      },
    });
  };
</script>`,

  React: `npm install @uverus/react

// UverusButton.tsx
import { useUverusPay } from '@uverus/react';

export function PayButton() {
  const initializePayment = useUverusPay({
    publicKey: process.env.NEXT_PUBLIC_UVERUS_KEY!,
    email: 'customer@example.com',
    amount: 500000, // kobo
    currency: 'NGN',
    onSuccess: (reference) => {
      console.log('Success:', reference);
    },
    onClose: () => console.log('Closed'),
  });

  return <button onClick={initializePayment}>Pay ₦5,000</button>;
}`,

  "Next.js": `npm install @uverus/react

// app/checkout/page.tsx
'use client';
import { useUverusPay } from '@uverus/react';

export default function CheckoutPage() {
  const pay = useUverusPay({
    publicKey: process.env.NEXT_PUBLIC_UVERUS_KEY!,
    email: 'customer@example.com',
    amount: 500000,
    currency: 'NGN',
    onSuccess: async (ref) => {
      // Verify via API route
      await fetch('/api/verify-payment', {
        method: 'POST',
        body: JSON.stringify({ reference: ref }),
      });
    },
  });

  return <button onClick={pay}>Checkout</button>;
}

// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { reference } = await req.json();
  const res = await fetch(
    \`https://api.uverus.com/v1/payments/verify/\${reference}\`,
    { headers: { Authorization: \`Bearer \${process.env.UVERUS_SECRET_KEY}\` } }
  );
  return NextResponse.json(await res.json());
}`,

  "Node.js": `npm install @uverus/node

const Uverus = require('@uverus/node');

const uverus = new Uverus(process.env.UVERUS_SECRET_KEY);

// Initialize payment
const payment = await uverus.payment.initialize({
  email: 'customer@example.com',
  amount: 500000, // kobo
  currency: 'NGN',
  reference: 'unique-ref-' + Date.now(),
  callback_url: 'https://yourdomain.com/callback',
});

console.log(payment.data.authorization_url);

// Verify payment
const verification = await uverus.payment.verify(reference);
console.log(verification.data.status); // 'success'

// Webhook verification
const isValid = uverus.webhook.verify(
  req.headers['x-uverus-signature'],
  req.body,
  process.env.UVERUS_WEBHOOK_SECRET
);`,

  Python: `pip install uverus

import uverus

uverus.api_key = 'sk_test_YOUR_SECRET_KEY'

# Initialize payment
payment = uverus.Payment.initialize(
    email='customer@example.com',
    amount=500000,  # kobo
    currency='NGN',
    reference=f'ref-{int(time.time())}',
    callback_url='https://yourdomain.com/callback',
)
print(payment['data']['authorization_url'])

# Verify payment
result = uverus.Payment.verify(reference='your-reference')
print(result['data']['status'])  # 'success'

# Verify webhook
is_valid = uverus.Webhook.verify(
    signature=request.headers.get('X-Uverus-Signature'),
    payload=request.data,
    secret=os.environ['UVERUS_WEBHOOK_SECRET'],
)`,

  Flutter: `# pubspec.yaml
dependencies:
  uverus_flutter: ^1.0.0

// main.dart
import 'package:uverus_flutter/uverus_flutter.dart';

final uverus = UverusPayment(
  publicKey: 'pk_test_YOUR_PUBLIC_KEY',
  secretKey: 'sk_test_YOUR_SECRET_KEY',
);

await uverus.charge(
  context: context,
  email: 'customer@example.com',
  amount: 500000, // kobo
  currency: 'NGN',
  reference: 'ref-\${DateTime.now().millisecondsSinceEpoch}',
  onSuccess: (reference) {
    print('Payment successful: \$reference');
  },
  onError: (error) {
    print('Payment error: \$error');
  },
  onCancel: () {
    print('Payment cancelled');
  },
);`,
};

const LINKS = [
  {
    label: "API Reference",
    href: "https://docs.uverus.com/api",
    desc: "Full REST API documentation",
  },
  {
    label: "Webhook Guide",
    href: "https://docs.uverus.com/webhooks",
    desc: "Events, signatures, retries",
  },
  {
    label: "Testing Guide",
    href: "https://docs.uverus.com/testing",
    desc: "Test cards and scenarios",
  },
  {
    label: "GitHub",
    href: "https://github.com/uverus",
    desc: "Open-source SDKs",
  },
];

export default function SdkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("JavaScript");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(CODE[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SDK & Docs</h1>
        <p className="text-muted-foreground mt-1">
          Integration guides and code samples for every platform.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-card rounded-xl border shadow-fintech p-4 hover:bg-muted/20 transition-colors flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{l.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">{l.desc}</p>
          </a>
        ))}
      </div>

      {/* Code samples */}
      <div className="bg-gradient-card rounded-xl border shadow-fintech overflow-hidden">
        <div className="border-b px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold">Integration Code</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${activeTab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={copy}
            className="absolute top-3 right-3 p-2 bg-muted/80 hover:bg-muted rounded-lg transition-colors z-10"
          >
            {copied ? (
              <CheckCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <pre className="p-5 overflow-x-auto text-xs leading-relaxed font-mono text-foreground/90 max-h-[480px] overflow-y-auto">
            <code>{CODE[activeTab]}</code>
          </pre>
        </div>
      </div>

      {/* Test credentials */}
      <div className="bg-gradient-card rounded-xl border shadow-fintech p-5 space-y-3">
        <h3 className="font-semibold">Test Credentials</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            {
              label: "Successful payment",
              card: "4084084084084081",
              exp: "01/99",
              cvv: "408",
            },
            {
              label: "Insufficient funds",
              card: "4084084084084057",
              exp: "01/99",
              cvv: "408",
            },
            {
              label: "Card declined",
              card: "4111111111111111",
              exp: "01/99",
              cvv: "111",
            },
            {
              label: "Requires 3DS / OTP",
              card: "5531886652142950",
              exp: "09/32",
              cvv: "564",
            },
          ].map((tc) => (
            <div
              key={tc.label}
              className="bg-muted/40 rounded-lg p-3 space-y-1"
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {tc.label}
                </Badge>
              </div>
              <p className="font-mono text-xs">{tc.card}</p>
              <p className="text-xs text-muted-foreground">
                Exp: {tc.exp} · CVV: {tc.cvv} · PIN: 1234 · OTP: 123456
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
