import React, { useState } from 'react'
import './App.css'
import p2p from './images/p2p.jpg'


function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost'

function App() {
	const [name, setName] = useState('Ishaa')

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
			t.json()
		)

		console.log(data)

		const options = {
			key: __DEV__ ? 'rzp_test_5DlRkg0OzGhjtL' : 'PRODUCTION_KEY',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Ishaa',
			description: 'P2P Money Transfer',
			image: 'http://localhost:1337/logo.svg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name,
				email: 'ishaa.mangalgi@gmail.com',
				phone_number: '98989898989'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	

	return (
		<div className="App" styles={{ backgroundImage:`url(${p2p})` }}>
			<header className="App-header"> 
			{/* <div class="input-container ic1">
        		<input id="Name" class="input" type="text" placeholder=" " />
       		 <div class="cut"></div>
        		<label for="Name" class="placeholder">Name</label>
      		</div>
      		<div class="input-container ic2">
        		<input id="Phone No" class="input" type="text" placeholder=" " />
        	<div class="cut"></div>
        		<label for="Phone No" class="placeholder">Phone Number</label>
      		</div>
      		<div class="input-container ic2">
        		<input id="email" class="input" type="text" placeholder=" " />
       			<div class="cut cut-short"></div>
        		<label for="email" class="placeholder">Email </label>
      		</div> */}
				<p>
					P2P Money Transfer System<code></code> 
				</p>
				<button
					className="App-link"
					onClick={displayRazorpay}
					target="_blank"
					rel="noopener noreferrer"
				>
					PAY NOW!
				</button>
			</header>
		</div>
	)
	
}

export default App
