
const stripe = Stripe("pk_live_51JHrtfJH89UsRzV755Lrw6IE0j1hEIgbq3OtNJ8NLgMRE6sDKJky5s4WC9h50zzpQzFFcLxhNMmZOUsKupYx2IZi00uCCUk5hu");
let elements, card, cardNumberElement, cardExpiryElement, cardCvcElement;

// Fetches a payment intent and captures the client secret
async function initialize() {
  
  style = {
//     family: 'Termina',
//     src: 'url(https://cdn.shopify.com/s/files/1/0574/1087/9650/t/5/assets/Termina-Medium.woff2)',
//     weight: '500',
    style: {
      base: {
//         iconColor: '#fff',
        color: '#96795d',
//         fontWeight: '500',
//         fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontFamily: 'Termina',
        fontSize: '12px',
        letterSpacing: '6px',
        textTransform: 'uppercase',
//         fontSmoothing: 'antialiased',
        lineHeight: '48px', 
//         ':-webkit-autofill': {
//           color: '#fce883',
//         },
//         '::placeholder': {
//           color: '#fff',
//         },
      },
      invalid: {
        iconColor: '#FF0000 ',
        color: '#FF0000 ',
      },
  	},
  };

  elements = stripe.elements({
  fonts: [{
    family:'Termina',
    src: "url('https://cdn.shopify.com/s/files/1/0574/1087/9650/t/5/assets/Termina-Medium.woff2')"
  }]
});
  cardNumber = elements.create('cardNumber', style);
  cardExpiry = elements.create('cardExpiry', style);
  cardCvc = elements.create('cardCvc', style);
  
  cardNumber.mount('#card-number');
  cardExpiry.mount('#card-expiry');
  cardCvc.mount('#card-cvc');
 
//   card = elements.create('card', style);
//   card.mount('#card-element');

}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  let billingEmail = document.querySelector('#email').value;
  let billingFName = document.querySelector('#f-name').value;
  let billingSName = document.querySelector('#s-name').value;

  let tokenCard = await stripe.createToken(cardNumber).then(function(result) {
    if (result.error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('payment-message');
      errorElement.textContent = result.error.message;
    } else {
      console.log(result);
      return result?.token?.id;
    }
  });

  var postData = {
    'gateway_data': {id: 2, stripe_token: tokenCard},
        
//	 100$ billing
    'billing_id': 71166,
    'plan_id': 34890,
        
//  0.5$ billing
//     'billing_id': 76336,
//     'plan_id': 36637,
      
    'email': billingEmail,
    'first_name': billingFName,
    'last_name': billingSName,
    'domain': "shop-cierto.myshopify.com"
  };

  $.post('https://mem.boldapps.net/front_end/purchase', postData).then(function (response) {
//     console.log(response);
    if (!response.success && response.success != undefined) {
      setLoading(false);
      $('#payment-message').empty().text(response.error).removeClass('hidden');
      return;
    }

	window.location.href = response.redirect_url == undefined ? 'https://shop-cierto.myshopify.com/account/login/#regsuccess' : response.redirect_url + '#regsuccess';

  });

}

initialize();
document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#btn-submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#btn-submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

  function authorizeClub(e) {
    if(document.getElementById("authorize-club").checked) {
    document.getElementById("btn-submit").removeAttribute("disabled");
    }else {
    document.getElementById("btn-submit").setAttribute("disabled","");
    }
  }