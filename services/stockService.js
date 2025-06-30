import apiService from '../services/apiService';

/**
 * Stock data operations
 */
class StockService {
  /**
   * Fetch top gainers and losers from Alpha Vantage API
   * @returns {Promise} - Formatted stock data
   */
  async fetchTopGainersLosers() {
    try {
      const response = await apiService.getTopGainersLosers();
      
      if (!response.success) {
        throw new Error(response.error);
      }

      return this.formatStockData(response.data);
    } catch (error) {
      console.error('Error fetching top gainers/losers:', error);
      throw error;
    }
  }

  /**
   * Format API response data to match our app structure
   * @param {Object} apiData - Raw API response
   * @returns {Object} - Formatted data
   */
  formatStockData(apiData) {
    const formatStockList = (stocks) => {
      return stocks.map((stock, index) => ({
        id: index + 1,
        ticker: stock.ticker,
        name: this.getCompanyName(stock.ticker), // Placeholder - you might want to get real company names
        price: `$${parseFloat(stock.price).toFixed(2)}`,
        change: stock.change_percentage,
        changeAmount: `$${parseFloat(stock.change_amount).toFixed(2)}`,
        volume: stock.volume,
      }));
    };

    return {
      metadata: apiData.metadata,
      lastUpdated: apiData.last_updated,
      topGainers: formatStockList(apiData.top_gainers || []),
      topLosers: formatStockList(apiData.top_losers || []),
      mostActive: formatStockList(apiData.most_actively_traded || []),
    };
  }

  /**
   * Get company name from ticker (placeholder - you might want to implement a ticker-to-name mapping)
   * @param {string} ticker - Stock ticker symbol
   * @returns {string} - Company name
   */
  getCompanyName(ticker) {
    // This is a placeholder. In a real app, you might have a mapping or another API call
    const knownTickers = {
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'MSFT': 'Microsoft Corp.',
      'AMZN': 'Amazon.com Inc.',
      'GOOGL': 'Alphabet Inc.',
      'META': 'Meta Platforms Inc.',
      'NFLX': 'Netflix Inc.',
      'NVDA': 'NVIDIA Corp.',
      'BRK.A': 'Berkshire Hathaway',
      'BRK.B': 'Berkshire Hathaway',
      'UNH': 'UnitedHealth Group',
      'JNJ': 'Johnson & Johnson',
      'JPM': 'JPMorgan Chase',
      'V': 'Visa Inc.',
      'PG': 'Procter & Gamble',
      'HD': 'Home Depot',
      'MA': 'Mastercard Inc.',
      'BAC': 'Bank of America',
      'ABBV': 'AbbVie Inc.',
      'PFE': 'Pfizer Inc.',
      'KO': 'Coca-Cola',
      'AVGO': 'Broadcom Inc.',
      'PEP': 'PepsiCo Inc.',
      'TMO': 'Thermo Fisher',
      'COST': 'Costco Wholesale',
      'DIS': 'Walt Disney',
      'ABT': 'Abbott Laboratories',
      'ACN': 'Accenture',
      'VZ': 'Verizon',
      'ADBE': 'Adobe Inc.',
      'DHR': 'Danaher Corp.',
      'WMT': 'Walmart Inc.',
      'TXN': 'Texas Instruments',
      'NEE': 'NextEra Energy',
      'BMY': 'Bristol Myers',
      'T': 'AT&T Inc.',
      'PM': 'Philip Morris',
      'RTX': 'Raytheon Tech.',
      'LOW': 'Lowe\'s Companies',
      'ORCL': 'Oracle Corp.',
      'QCOM': 'Qualcomm Inc.',
    };

    return knownTickers[ticker] || `${ticker} Corp.`;
  }

  /**
   * Fetch company overview data
   * @param {string} symbol - Stock symbol
   * @returns {Promise} - Formatted company overview data
   */
  async fetchCompanyOverview(symbol) {
    try {
      const response = await apiService.getCompanyOverview(symbol);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      return this.formatCompanyOverview(response.data);
    } catch (error) {
      console.error('Error fetching company overview:', error);
      throw error;
    }
  }

  /**
   * Format company overview data
   * @param {Object} apiData - Raw API response
   * @returns {Object} - Formatted company data
   */
  formatCompanyOverview(apiData) {
    return {
      symbol: apiData.Symbol,
      name: apiData.Name,
      description: apiData.Description,
      exchange: apiData.Exchange,
      currency: apiData.Currency,
      country: apiData.Country,
      sector: apiData.Sector,
      industry: apiData.Industry,
      marketCap: apiData.MarketCapitalization,
      peRatio: apiData.PERatio,
      pegRatio: apiData.PEGRatio,
      bookValue: apiData.BookValue,
      dividendYield: apiData.DividendYield,
      eps: apiData.EPS,
      revenuePerShare: apiData.RevenuePerShareTTM,
      profitMargin: apiData.ProfitMargin,
      operatingMargin: apiData.OperatingMarginTTM,
      returnOnAssets: apiData.ReturnOnAssetsTTM,
      returnOnEquity: apiData.ReturnOnEquityTTM,
      week52High: apiData['52WeekHigh'],
      week52Low: apiData['52WeekLow'],
      movingAverage50: apiData['50DayMovingAverage'],
      movingAverage200: apiData['200DayMovingAverage'],
      sharesOutstanding: apiData.SharesOutstanding,
      beta: apiData.Beta,
      address: apiData.Address,
    };
  }
}

export default new StockService();
