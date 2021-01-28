const rateUrl = "https://www.cbr-xml-daily.ru/daily_json.js";
const selectedCart = [ { price: 20 }, { price: 45 }, { price: 67 }, { price: 1305 } ];

const currency = {
	available: {
		RUB: "rubles",
		EUR: "euros",
		USD: "US dollars",
		GBP: "pounds",
		JPY: "yens"
	},
	base: "USD",
};


getTotalCartPrice(selectedCart, currency, rateUrl).then(
	result => console.log(result)
).catch(
	error => console.log("Получена ошибка ", error)
);


async function getTotalCartPrice(selectedCart, currency, rateUrl){
	let sum = getTotalSum(selectedCart);
	let rate = await getRate(rateUrl);
	if (rate){
		//пересчет относительно базовой валюты веб сервиса - RUB
		let sumRub = currency.base === "RUB" ? sum : sum * rate.Valute[currency.base].Value;
		let totalCartPrice = 
		Object.keys(currency.available).reduce((previousValue, item) => {
			if (item === "RUB") {
				previousValue[currency.available[item]] = sumRub;
			} else {
				previousValue[currency.available[item]] = sumRub/rate.Valute[item].Value
			}
			return previousValue;
		}, {});
		return totalCartPrice;
	}
	

}

async function getRate(url){
	let response = await fetch(url);
	if (response.ok) {
	  let rate = response.json(); 
	  return rate;
	} else {
	  console.log("Ошибка подключения HTTP: " + response.status);
	}
	
}

function getTotalSum(cart){
	return cart.reduce((previousValue, item) => previousValue + item.price, 0);
}


