import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface BrowseFilters {
  distanceMax: number;
  ageMin: number;
  ageMax: number;
  interests: string[];
  sortBy: 'distance' | 'recent' | 'new';
}

interface BrowseFilterBarProps {
  filters: BrowseFilters;
  onFilterChange: (filters: BrowseFilters) => void;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const SORT_OPTIONS: Array<{ id: BrowseFilters['sortBy']; label: string; icon: string }> = [
  { id: 'distance', label: 'Mesafe', icon: '📍' },
  { id: 'recent', label: 'Son Aktif', icon: '🕐' },
  { id: 'new', label: 'Yeni', icon: '✨' },
];

const INTEREST_OPTIONS = [
  'Spor',
  'Sanat',
  'Müzik',
  'Yemek',
  'Seyahat',
  'Kitap',
  'Film',
  'Teknoloji',
  'Doğa',
  'Yoga',
];

export function BrowseFilterBar({
  filters,
  onFilterChange,
  isExpanded,
  onToggle,
}: BrowseFilterBarProps) {
  const updateFilter = (updates: Partial<BrowseFilters>) => {
    onFilterChange({ ...filters, ...updates });
  };

  const toggleInterest = (interest: string) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter(i => i !== interest)
      : [...filters.interests, interest];
    updateFilter({ interests: newInterests });
  };

  return (
    <View style={styles.container}>
      {/* Filter toggle button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => onToggle(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.filterIcon}>🔍</Text>
        <Text style={styles.filterText}>Filtrele</Text>
        <Text style={styles.toggleArrow}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Expanded filters */}
      {isExpanded && (
        <View style={styles.filterPanel}>
          {/* Sort options */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sıralama</Text>
            <View style={styles.sortOptions}>
              {SORT_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    filters.sortBy === option.id && styles.sortOptionActive,
                  ]}
                  onPress={() => updateFilter({ sortBy: option.id })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sortIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.sortLabel,
                    filters.sortBy === option.id && styles.sortLabelActive,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance slider */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sectionLabel}>Mesafe</Text>
              <Text style={styles.sliderValue}>{Math.round(filters.distanceMax)} km</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={filters.distanceMax}
              onValueChange={(value: number) => updateFilter({ distanceMax: value })}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.surfaceBorder}
              thumbTintColor={Colors.primary}
            />
          </View>

          {/* Age range sliders */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sectionLabel}>Yaş</Text>
              <Text style={styles.sliderValue}>
                {filters.ageMin} - {filters.ageMax}
              </Text>
            </View>

            <View style={styles.ageSliderContainer}>
              <Text style={styles.ageLabel}>Min</Text>
              <Slider
                style={styles.ageSlider}
                minimumValue={18}
                maximumValue={filters.ageMax - 1}
                step={1}
                value={filters.ageMin}
                onValueChange={(value: number) => updateFilter({ ageMin: value })}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.surfaceBorder}
                thumbTintColor={Colors.primary}
              />
            </View>

            <View style={styles.ageSliderContainer}>
              <Text style={styles.ageLabel}>Max</Text>
              <Slider
                style={styles.ageSlider}
                minimumValue={filters.ageMin + 1}
                maximumValue={80}
                step={1}
                value={filters.ageMax}
                onValueChange={(value: number) => updateFilter({ ageMax: value })}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.surfaceBorder}
                thumbTintColor={Colors.primary}
              />
            </View>
          </View>

          {/* Interest tags */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>İlgiler</Text>
            <View style={styles.interestTags}>
              {INTEREST_OPTIONS.map(interest => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestTag,
                    filters.interests.includes(interest) && styles.interestTagActive,
                  ]}
                  onPress={() => toggleInterest(interest)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.interestText,
                      filters.interests.includes(interest) && styles.interestTextActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  filterIcon: {
    fontSize: 18,
  },
  filterText: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.sm,
    flex: 1,
    textAlign: 'center',
  },
  toggleArrow: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
  },
  filterPanel: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderValue: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ageSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  ageLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    width: 30,
  },
  ageSlider: {
    flex: 1,
    height: 40,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sortOption: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sortOptionActive: {
    backgroundColor: `${Colors.primary}20`,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  sortIcon: {
    fontSize: 20,
  },
  sortLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
  },
  sortLabelActive: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestTag: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  interestTagActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  interestText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
  },
  interestTextActive: {
    color: Colors.background,
    fontFamily: Typography.fontFamily.bold,
  },
});
