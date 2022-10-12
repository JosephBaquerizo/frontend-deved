import Stripe from 'stripe';
const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);
import { getSession } from '@auth0/nextjs-auth0';

// los console log que se hagan en api, se ejecutaran en el terminal de vscode pero no en el lado del cliente (pagina web)
export default async function handler(req, res) {

    const session = getSession(req, res);
    const user = session?.user;
    if (user) {
        const stripeId = user['http://localhost:3000/stripe_customer_id'];
        if (req.method === 'POST') {
            try {
                // Create checkout session
                const session = await stripe.checkout.sessions.create({
                    submit_type: 'pay',
                    mode: 'payment',
                    customer: stripeId,
                    payment_method_types: ['card'],
                    shipping_address_collection: {
                        allowed_countries: ['US', 'CA']
                    },
                    allow_promotion_codes: true,
                    shipping_options: [
                        {
                            shipping_rate: 'shr_1Ls7b6Iv3p1iMgH7oCZ15arT'
                        },
                        {
                            shipping_rate: 'shr_1Ls7RsIv3p1iMgH793PwNUlf'
                        }
                    ],
                    line_items: req.body.map(item => {
                        return {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: item.title,
                                    images: [item.image.data.attributes.formats.thumbnail.url]
                                },
                                unit_amount: item.price * 100,
                            },
                            adjustable_quantity: {
                                enabled: true,
                                minimum: 1,
                            },
                            quantity: item.quantity
                        }
                    }),
                    // Bring people to the success or failed page
                    success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${req.headers.origin}/canceled`,
                });
                // decir que todo esta bien y retornar la sesion
                res.status(200).json(session);
            } catch(error) {
                res.status(error.statusCode || 500).json(error.message);
            }
        }
    } else {
        if (req.method === 'POST') {
            try {
                // Create checkout session y para clientes sin loguear (se elimina el campo customer, stripe crea el suyo propio automaticamente)
                const session = await stripe.checkout.sessions.create({
                    submit_type: 'pay',
                    mode: 'payment',
                    payment_method_types: ['card'],
                    shipping_address_collection: {
                        allowed_countries: ['US', 'CA']
                    },
                    allow_promotion_codes: true,
                    shipping_options: [
                        {
                            shipping_rate: 'shr_1Ls7b6Iv3p1iMgH7oCZ15arT'
                        },
                        {
                            shipping_rate: 'shr_1Ls7RsIv3p1iMgH793PwNUlf'
                        }
                    ],
                    line_items: req.body.map(item => {
                        return {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: item.title,
                                    images: [item.image.data.attributes.formats.thumbnail.url]
                                },
                                unit_amount: item.price * 100,
                            },
                            adjustable_quantity: {
                                enabled: true,
                                minimum: 1,
                            },
                            quantity: item.quantity
                        }
                    }),
                    // Bring people to the success or failed page
                    success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${req.headers.origin}/canceled`,
                });
                // decir que todo esta bien y retornar la sesion
                res.status(200).json(session);
            } catch(error) {
                res.status(error.statusCode || 500).json(error.message);
            }
        }
    }

}