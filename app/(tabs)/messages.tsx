import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../../src/constants/theme';
import { ConversationList } from '../../src/components/chat/ConversationList';
import { useChatStore } from '../../src/store/chatStore';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { matches, typingMatchIds } = useChatStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesajlar</Text>
        <Text style={styles.subtitle}>{matches.length} eşleşme</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <ConversationList
          matches={matches}
          typingMatchIds={typingMatchIds}
          onPress={(id) => router.push(`/chat/${id}`)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.lg },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'] },
  subtitle: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginTop: 2 },
});
