import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, FlatList, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../src/constants/theme';
import { MessageBubble } from '../../src/components/chat/MessageBubble';
import { useChatStore } from '../../src/store/chatStore';
import { useUserStore } from '../../src/store/userStore';
import { useSocket } from '../../src/hooks/useSocket';
import api from '../../src/services/api';
import { emitTyping, emitJoinChat, emitLeaveChat } from '../../src/services/socket';
import type { Message } from '../../src/types/message';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const { conversations, addMessage, setMessages, markRead } = useChatStore();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const conv = conversations[id];
  const messages = conv?.messages ?? [];
  const match = conv?.match;

  useSocket({
    onNewMessage: useCallback((msg: Message) => {
      if (msg.matchId === id) addMessage(id, msg);
    }, [id]),
  });

  useEffect(() => {
    emitJoinChat(id);
    markRead(id);
    loadMessages();
    return () => { emitLeaveChat(id); };
  }, [id]);

  const loadMessages = async () => {
    try {
      const { data } = await api.get(`/messages/${id}?limit=50`);
      setMessages(id, data.data, data.hasMore, data.cursor);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!text.trim() || sending) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      const { data } = await api.post(`/messages/${id}`, { content, type: 'text' });
      addMessage(id, data.data);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (val: string) => {
    setText(val);
    emitTyping(id);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{match?.user.name ?? '...'}</Text>
          <Text style={styles.headerSub}>Eşleşmen</Text>
        </View>
        <TouchableOpacity onPress={() => router.push(`/profile/${match?.user.id}`)}>
          <Text style={{ fontSize: 22 }}>👤</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Messages */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} isMine={item.senderId === user?.id} />
          )}
          contentContainerStyle={{ paddingVertical: Spacing.base }}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder="Mesaj yaz..."
          placeholderTextColor={Colors.textMuted}
          value={text}
          onChangeText={handleTyping}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity onPress={send} disabled={!text.trim() || sending} style={styles.sendBtn}>
          <LinearGradient colors={Gradients.primary} style={styles.sendGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.sendIcon}>➤</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingBottom: Spacing.md, gap: Spacing.md },
  backBtn: { padding: Spacing.sm },
  backText: { color: Colors.textPrimary, fontSize: 22 },
  headerInfo: { flex: 1 },
  headerName: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.lg },
  headerSub: { color: Colors.textSecondary, fontSize: Typography.fontSize.xs },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.surfaceBorder },
  input: { flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, color: Colors.textPrimary, fontFamily: Typography.fontFamily.regular, fontSize: Typography.fontSize.base, maxHeight: 120 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#fff', fontSize: 18 },
});
