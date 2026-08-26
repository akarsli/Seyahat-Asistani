import React, { createContext, useState, useContext, useEffect } from 'react';

// Fallback exchange rates relative to USD if API fails
const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  TRY: 33.5,
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  TRY: '₺',
};

const CurrencyContext = createContext();

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_RATES);

  // Fetch live exchange rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          // Update rates dynamically
          setExchangeRates({
            USD: 1.0,
            EUR: data.rates.EUR || FALLBACK_RATES.EUR,
            GBP: data.rates.GBP || FALLBACK_RATES.GBP,
            TRY: data.rates.TRY || FALLBACK_RATES.TRY,
          });
        }
      } catch (error) {
        console.error('Failed to fetch live exchange rates, using fallback:', error);
      }
    };

    fetchRates();
  }, []);

  // Parses text to find prices, converts them from USD to the selected currency,
  // and formats them back into the string.
  const convertPriceText = (text) => {
    if (!text) return text;
    
    // Regex to detect standard currency patterns: e.g. $150, 150$, €150, 150€, 150 EUR, 150 TL
    const regex = /(\$|€|£|₺|USD|EUR|GBP|TL|TRY)?\s*([\d,]+(?:\.\d+)?)\s*(\$|€|£|₺|USD|EUR|GBP|TL|TRY)?/g;

    return text.replace(regex, (match, preSymbol, numberStr, postSymbol) => {
      const symbol = (preSymbol || postSymbol || '').trim().toUpperCase();
      if (!symbol) return match; // Not a currency if no symbol found
      
      // Normalize input currency
      let inputCurrency = 'USD';
      if (symbol === '€' || symbol === 'EUR') inputCurrency = 'EUR';
      if (symbol === '£' || symbol === 'GBP') inputCurrency = 'GBP';
      if (symbol === '₺' || symbol === 'TL' || symbol === 'TRY') inputCurrency = 'TRY';

      // Parse the numeric value
      const value = parseFloat(numberStr.replace(/,/g, ''));
      if (isNaN(value)) return match;

      // Convert to Base (USD) first using live rates
      const valueInUSD = value / exchangeRates[inputCurrency];
      
      // Convert to target Currency
      const convertedValue = valueInUSD * exchangeRates[currency];

      // Format output
      const targetSymbol = CURRENCY_SYMBOLS[currency];
      
      let formattedNumber;
      if (convertedValue >= 100) {
        // 100 ve üzeri sayılarda en yakın 10'luğa yuvarla (Örn: 2164.95 -> 2160)
        formattedNumber = (Math.round(convertedValue / 10) * 10).toString();
      } else if (convertedValue >= 10) {
        // 10-100 arası sayılarda en yakın tam sayıya yuvarla (Örn: 45.9 -> 46)
        formattedNumber = Math.round(convertedValue).toString();
      } else {
        // 10'dan küçük sayılarda küsuratları koru (tam sayıysa virgül koyma)
        formattedNumber = convertedValue % 1 === 0 ? convertedValue.toFixed(0) : convertedValue.toFixed(2);
      }

      return `${targetSymbol}${formattedNumber}`;
    });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPriceText }}>
      {children}
    </CurrencyContext.Provider>
  );
};
