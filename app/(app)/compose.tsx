import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { createPost, updatePost } from '../../src/api/client';
import { usePostsStore } from '../../src/store/posts';

export default function ComposeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const selectedPost = usePostsStore((s) => s.selectedPost);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(id && selectedPost ? selectedPost.date.slice(0, 10) : today);
  const [body, setBody] = useState(id && selectedPost ? selectedPost.body : '');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!body.trim()) {
      Alert.alert('Error', 'Post body cannot be empty');
      return;
    }
    setLoading(true);
    try {
      if (id) {
        await updatePost(Number(id), body, date);
      } else {
        await createPost(body, date);
      }
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{id ? 'Edit' : 'New Entry'}</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#4a9eff" />
            : <Text style={styles.save}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>Date:</Text>
        <TextInput
          style={styles.dateInput}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#555"
        />
      </View>

      <TextInput
        style={styles.bodyInput}
        value={body}
        onChangeText={setBody}
        multiline
        placeholder="Write your entry..."
        placeholderTextColor="#555"
        autoFocus
        textAlignVertical="top"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  cancel: { color: '#ff6b6b', fontSize: 16 },
  title: { color: '#e0e0e0', fontSize: 18, fontWeight: '600' },
  save: { color: '#4a9eff', fontSize: 16, fontWeight: '600' },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  dateLabel: { color: '#777', fontSize: 14, marginRight: 8 },
  dateInput: { color: '#e0e0e0', fontSize: 14, flex: 1 },
  bodyInput: { flex: 1, padding: 20, color: '#e0e0e0', fontSize: 16, lineHeight: 26 },
});
