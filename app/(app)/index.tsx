import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../src/api/client';
import { useAuthStore } from '../../src/store/auth';
import { usePostsStore } from '../../src/store/posts';

export default function RecentScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const setSelectedPost = usePostsStore((s) => s.setSelectedPost);

  const { data, isLoading } = useQuery({
    queryKey: ['recent'],
    queryFn: () => getPosts({ $limit: 30 }),
  });

  function handleLogout() {
    logout().then(() => router.replace('/(auth)/login'));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>pa2026</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/(app)/history')} style={styles.navBtn}>
            <Text style={styles.navBtnText}>History</Text>
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

      {isLoading ? (
        <ActivityIndicator color="#4a9eff" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => { setSelectedPost(item); router.push({ pathname: '/(app)/post/[id]', params: { id: item.id } }); }}
            >
              <Text style={styles.date}>{item.date.slice(0, 10)}</Text>
              <Text style={styles.preview} numberOfLines={2}>{item.body}</Text>
            </TouchableOpacity>
          )}
        />
      )}

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
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  date: { color: '#4a9eff', fontSize: 12, marginBottom: 4 },
  preview: { color: '#ccc', fontSize: 14, lineHeight: 20 },
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
