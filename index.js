const app = require('express')()
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Schema = require('./Schema')


app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'rzp_test_5DlRkg0OzGhjtL',
	key_secret: 'zYJV5Uz8GrLbnnaLaGmhy0BY'
})

  app.get('/logo.svg', (req, res) => {
	res.sendFile(path.join(__dirname, 'logo.svg')) 
}) 

app.post('/verification', (req, res) => {
	// do a validation
	const secret = '12345678'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])
	

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = '499'
	const currency = 'INR'
	//const status = 'ok'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount,
			//status: response.status
		})
		const Pay = new Schema({
			id: response.id,
			amount: response.amount,
			currency: response.currency
		});

		Pay.save((err, data) => {
			if(err){
				res.status(400).json({
					error: "Not saved in DB",
				});
			}
		})
	} catch (error) {
		console.log(error)
	}
})

app.listen(1337, () => {
	console.log('Listening on 1337')
})

mongoose.connect('mongodb+srv://Ishaa_Vijay:Ishaa123@cluster0.zcsve.mongodb.net/P2PDb?retryWrites=true&w=majority',{useNewUrlParser:true});

mongoose.connection.once('open',function(){

    console.log('MongoDB connected')

}).on('error', function(error){
	console.log('error is:' ,error);
});


