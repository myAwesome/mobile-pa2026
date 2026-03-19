import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getMonths, getPostsByMonth, MonthEntry, Post } from '../../src/api/client';
import { useAuthStore } from '../../src/store/auth';

export default function HomeScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
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

  function handleLogout() {
    logout().then(() => router.replace('/(auth)/login'));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>pa2026</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/(app)/recent')} style={styles.navBtn}>
            <Text style={styles.navBtnText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(app)/search')} style={styles.navBtn}>
            <Text style={styles.navBtnText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(app)/on-this-day')} style={styles.navBtn}>
            <Text style={styles.navBtnText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.navBtn}>
            <Text style={[styles.navBtnText, { color: '#ff6b6b' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.columns}>
        {/* Months list */}
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

        {/* Posts list */}
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
                  onPress={() => router.push({ pathname: '/(app)/post/[id]', params: { id: item.id } })}
                >
                  <Text style={styles.postDate}>{item.date.slice(0, 10)}</Text>
                  <Text style={styles.postPreview} numberOfLines={2}>{item.body}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>

      {/* Compose FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(app)/compose')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  title: { color: '#e0e0e0', fontSize: 20, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 12 },
  navBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  navBtnText: { color: '#4a9eff', fontSize: 14 },
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
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4a9eff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
