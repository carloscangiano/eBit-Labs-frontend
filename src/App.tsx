import { default as React, useState, useEffect } from "react";
import './app.css';
interface EthCurrency {
  type: string,
  price: number,
  floor: number,
  decimal: string,
  timeStamp: string,
  rate: number,
  htmlPrice: any
};

function App() {
  const initialCurrency = { 
    type: '',
    price: 0,
    floor: 0,
    decimal: '',
    timeStamp: '',
    rate: 0,
    htmlPrice: () => {}
  };
  const [ ethUsd, setEthUsd ] = useState<EthCurrency>( initialCurrency );
  const [ ethGbp, setEthGbp ] = useState<EthCurrency>( initialCurrency );

  useEffect(() => {
    if(ethUsd.price === 0) loadPrices();
    const timer = setInterval(loadPrices, 5000);
    return () => clearInterval(timer);
  }, [ethUsd]);
  
  const loadPrices = () => {
    loadPrice('ETHUSD');
    loadPrice('ETHGBP');
  };

  const loadPrice = (currency: string) : void => {
    fetch(`http://34.117.120.204/api/v1/fx/${currency}/ohlc`)
      .then(res => res.json())
      .then(data => {
        if(currency === 'ETHUSD') {
          setEthUsd(formatData(data))
        } else {
          setEthGbp(formatData(data))
        };        
      });
  };

  const getRate = (pair: string, newValue: number): any[] => {
    const oldValue : number = pair == "ETH/USD" ? ethUsd.price: ethGbp.price;
    let index = oldValue.toString().length;
    for (let i = 0; i < newValue.toString().length; i++) {
      if(oldValue.toString()[i] != newValue.toString()[i]) {
        index = i;
        break;
      };
    };
    return [index, ((oldValue === newValue || oldValue === 0) ? 'grey' : (oldValue > newValue ? 'red' : 'green'))];    
  };

  const formatData = (data: any) : EthCurrency => {
    const price : number = Number(data.close);
    const decimal : string = data.close.split('.')[1];
    const floor : number = Math.floor(price);
    const [index, rate] = getRate(data.pair, price);
    
    const htmlPrice : any = () => <> 
          <span className="text-gray-500">
            {floor.toString().substring(0, index)}</span>
          <span className={`text-${rate}-500`}>
          {floor.toString().substring(index, floor.toString().length)}</span>
          {index != price.toString().length-1 && <span className={`text-2xl text-${rate}-500`}>.{decimal || '00'}</span>}
          {index == price.toString().length-1 && <span className={`text-2xl`}>.{decimal.toString().substring(0,1)}<span className={`text-${rate}-500`}>{decimal.toString().substring(1,2)}</span></span>}
          </>;

    return {
      type: data.pair,
      price,
      floor,
      decimal,
      timeStamp: new Date(data.startTime.seconds * 1000).toISOString(),
      rate,
      htmlPrice
    };    
  };

  return (
    <div className="pt-12 bg-gray-50 sm:pt-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ethereum Price
          </h2>
        </div>
      </div>
      <div className="pb-12 mt-10 bg-white sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-50" />
          <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl className="w-1/3 mx-auto bg-white rounded-lg shadow-lg flex" style={{ width: "min-content" }}>
                <div className="flex flex-col p-6 text-center border-t border-gray-100 tooltip border-right" style={{ border: "2px solid gray" }}>
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    ETH/USD
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-gray-500">
                    {ethUsd.htmlPrice()}
                  </dd>
                  <span className="tooltiptext">{ethUsd.timeStamp}</span>
                </div>

                <div className="flex flex-col p-6 text-center border-t border-gray-100 tooltip border-left" style={{ border: "2px solid gray" }}>
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    ETH/GBP
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-gray-500">
                    {ethGbp.htmlPrice()}
                  </dd>
                  <span className="tooltiptext">{ethUsd.timeStamp}</span>
                </div>

              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
