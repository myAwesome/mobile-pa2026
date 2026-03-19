import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getMonths, getPostsByMonth } from '../../src/api/client';
import { usePostsStore } from '../../src/store/posts';

export default function HistoryScreen() {
  const router = useRouter();
  const setSelectedPost = usePostsStore((s) => s.setSelectedPost);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const { data: months, isLoading: loadingMonths } = useQuery({
    queryKey: ['months'],
    queryFn: getMonths,
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', selectedMonth],
    queryFn: () => getPostsByMonth(selectedMonth!),
    enabled: !!selectedMonth,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.columns}>
        <View style={styles.monthsPanel}>
          {loadingMonths ? (
            <ActivityIndicator color="#4a9eff" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={months}
              keyExtractor={(item) => item.ym}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.monthItem, selectedMonth === item.ym && styles.monthItemActive]}
                  onPress={() => setSelectedMonth(item.ym)}
                >
                  <Text style={styles.monthText}>{item.m}/{item.y}</Text>
                  <Text style={styles.monthCount}>{item.count}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.postsPanel}>
          {!selectedMonth ? (
            <Text style={styles.placeholder}>← Select a month</Text>
          ) : loadingPosts ? (
            <ActivityIndicator color="#4a9eff" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.postItem}
                  onPress={() => { setSelectedPost(item); router.push({ pathname: '/(app)/post/[id]', params: { id: item.id } }); }}
                >
                  <Text style={styles.postDate}>{item.date.slice(0, 10)}</Text>
                  <Text style={styles.postPreview} numberOfLines={2}>{item.body}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  back: { color: '#4a9eff', fontSize: 16, width: 60 },
  title: { color: '#e0e0e0', fontSize: 18, fontWeight: '600' },
  columns: { flex: 1, flexDirection: 'row' },
  monthsPanel: { width: 90, borderRightWidth: 1, borderRightColor: '#222' },
  monthItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  monthItemActive: { backgroundColor: '#1a2a3a' },
  monthText: { color: '#aaa', fontSize: 13 },
  monthCount: { color: '#555', fontSize: 11, marginTop: 2 },
  postsPanel: { flex: 1 },
  placeholder: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 14 },
  postItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  postDate: { color: '#4a9eff', fontSize: 12, marginBottom: 4 },
  postPreview: { color: '#ccc', fontSize: 14, lineHeight: 20 },
});
