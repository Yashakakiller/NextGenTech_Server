const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { Connection } = require('./database/db');
const { userRouter } = require('./routes/UserRoutes');
const { categoryRouter } = require('./routes/CategoryRoutes');
const { productRouter } = require('./routes/ProductRoutes');
const { wishlistRouter } = require('./routes/WishlistRouter');
const { cartRouter } = require('./routes/CartRouter');
const { bannerRouter } = require('./routes/BannerRouter');
const { contactRouter } = require('./routes/ContactRouter');

dotenv.config();
const PORT = process.env.PORT || 5000;
Connection();
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(bodyparser.json({ extended: true, limit: '100mb' }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(limiter);

app.use('/accounts/user', userRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/wishlist', wishlistRouter);
app.use('/cart', cartRouter);
app.use('/banner', bannerRouter);
app.use('/contact', contactRouter);



app.use("/",(req,res)=>{
    res.json("hello")
})


app.listen(PORT, () => {
  console.log('server started on PORT ' + PORT);
});
