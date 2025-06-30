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
        changeAmount: stock.change_amount,
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
    };

    return knownTickers[ticker] || ticker;
  }
}

export default new StockService();
