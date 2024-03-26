require('dotenv').config();
const express = require("express")
const app = express();
const PORT = process.env.PORT || 7000;
const cors = require("cors")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

app.use(express.json())
app.use(cors())

// checkout api

app.get('/', (req, res) => {
    res.send('products api running new deploy');
});

app.post("/api/create-checkout-session", async(req, res)=>{
    const {products} = req.body;

    const lineItems = products.map((product)=>({
            price_data: {
                currency: "inr",
                product_data:{
                name:product.dish
                },
                unit_amount:product.price * 100,
            },

            quantity: product.qnty
    }))

    const session = await stripe.checkout.sessions.create({
    
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url: "https://react-redux-toolkit-e-commerce-food-card-frontend.vercel.app/success",
        cancel_url: "https://react-redux-toolkit-e-commerce-food-card-frontend.vercel.app/cancel"

    })

    res.json({id:session.id})
})

app.listen(7000, () => {
    console.log('Server is listenin on PORT :' + PORT);
})