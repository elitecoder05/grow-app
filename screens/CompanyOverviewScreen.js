import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCompanyOverview } from '../hooks/useCompanyOverview';

const { width } = Dimensions.get('window');

const InfoCard = ({ title, value, subtitle }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    {subtitle && <Text style={styles.infoSubtitle}>{subtitle}</Text>}
  </View>
);

const MetricRow = ({ label, value }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value || 'N/A'}</Text>
  </View>
);

const TagButton = ({ text, color = '#e3f2fd' }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

export default function CompanyOverviewScreen({ route, navigation }) {
  const { symbol, currentPrice, change } = route.params;
  const { companyData, loading, error, refreshData } = useCompanyOverview(symbol);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Details Screen',
      headerRight: () => (
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => setIsWishlisted(!isWishlisted)}
        >
          <Ionicons
            name={isWishlisted ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isWishlisted]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00D09C" />
        <Text style={styles.loadingText}>Loading company overview...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF4444" />
        <Text style={styles.errorText}>Error loading company data</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!companyData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No company data available</Text>
      </View>
    );
  }

  const isPositive = change && !change.startsWith('-');
  const changeColor = isPositive ? '#00C851' : '#FF4444';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Company Header */}
      <View style={styles.header}>
        <View style={styles.companyIcon}>
          <Text style={styles.companyIconText}>
            {companyData.symbol?.charAt(0) || '?'}
          </Text>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{companyData.name}</Text>
          <Text style={styles.companyTicker}>
            {companyData.symbol} • {companyData.exchange}
          </Text>
          <Text style={styles.companySector}>
            {companyData.sector} • {companyData.country}
          </Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>{currentPrice}</Text>
          <Text style={[styles.priceChange, { color: changeColor }]}>
            {change}
          </Text>
        </View>
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Price Chart</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="trending-up" size={40} color="#ccc" />
          <Text style={styles.chartPlaceholderText}>Chart data will be displayed here</Text>
        </View>
        
        {/* Time Period Buttons */}
        <View style={styles.periodButtons}>
          {['1W', '1M', '3M', '6M', '1Y', '5Y'].map((period) => (
            <TouchableOpacity key={period} style={styles.periodButton}>
              <Text style={styles.periodButtonText}>{period}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About {companyData.symbol}</Text>
        <Text style={styles.description} numberOfLines={6}>
          {companyData.description || 'No description available for this company.'}
        </Text>
        
        {/* Industry Tags */}
        <View style={styles.tagsContainer}>
          {companyData.industry && (
            <TagButton text={companyData.industry} color="#e8f5e8" />
          )}
          {companyData.sector && (
            <TagButton text={companyData.sector} color="#e3f2fd" />
          )}
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricsColumn}>
            <InfoCard 
              title="52-Week Low" 
              value={companyData.week52Low ? `$${companyData.week52Low}` : 'N/A'} 
            />
            <InfoCard 
              title="Market Cap" 
              value={companyData.marketCap ? `$${(parseInt(companyData.marketCap) / 1000000000).toFixed(2)}B` : 'N/A'} 
            />
          </View>
          <View style={styles.metricsColumn}>
            <InfoCard 
              title="Current price" 
              value={currentPrice}
              subtitle="52-Week High"
            />
            <InfoCard 
              title="52-Week High" 
              value={companyData.week52High ? `$${companyData.week52High}` : 'N/A'} 
            />
          </View>
        </View>
      </View>

      {/* Financial Metrics */}
      <View style={styles.section}>
        <View style={styles.financialMetrics}>
          <MetricRow label="Market Cap" value={companyData.marketCap ? `$${(parseInt(companyData.marketCap) / 1000000000).toFixed(2)}B` : 'N/A'} />
          <MetricRow label="P/E Ratio" value={companyData.peRatio} />
          <MetricRow label="Beta" value={companyData.beta} />
          <MetricRow label="Dividend Yield" value={companyData.dividendYield ? `${(parseFloat(companyData.dividendYield) * 100).toFixed(2)}%` : 'N/A'} />
          <MetricRow label="Profit Margin" value={companyData.profitMargin ? `${(parseFloat(companyData.profitMargin) * 100).toFixed(2)}%` : 'N/A'} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#00D09C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  wishlistButton: {
    marginRight: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  companyIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  companyIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  companyTicker: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  companySector: {
    fontSize: 12,
    color: '#999',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16,
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  periodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  periodButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricsColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  financialMetrics: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
