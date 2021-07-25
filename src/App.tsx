import { default as React, useState, useEffect } from "react";

interface EthCurrency {
  type: string,
  price: number,
  floor: number,
  decimal: number,
  timeStamp: string
};

function App() {
  const [ ethUsd, setEthUsd ] = useState<EthCurrency>({ 
    type: '',
    price: 0,
    floor: 0,
    decimal: 0,
    timeStamp: ''
  });
  
  useEffect(() => {
    setInterval(loadPrice, 5000)
  }, []);

  const loadPrice = () : void => {
    fetch(`http://34.117.120.204/api/v1/fx/ETHUSD/ohlc`)
      .then(res => res.json())
      .then(data => setEthUsd(formatData(data)));
  };

  const formatData = (data: any) : EthCurrency => {
    const price : number = Number(data.close);
    const floor : number = Math.floor(price);

    return {
      type: data.pair,
      price,
      floor,
      decimal: data.close.split('.')[1],
      timeStamp: data.startTime.second
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
              <dl className="w-1/3 mx-auto bg-white rounded-lg shadow-lg">
                <div className="flex flex-col p-6 text-center border-t border-gray-100">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    ETH/USD
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-gray-500">
                    ${ethUsd.floor}<span className="text-2xl">.{ethUsd.decimal || '00'}</span>
                  </dd>
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
