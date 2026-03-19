import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../src/api/client';

export default function RecentScreen() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['recent'],
    queryFn: () => getPosts({ $limit: 30 }),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recent</Text>
        <View style={{ width: 60 }} />
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
              onPress={() => router.push({ pathname: '/(app)/post/[id]', params: { id: item.id } })}
            >
              <Text style={styles.date}>{item.date.slice(0, 10)}</Text>
              <Text style={styles.preview} numberOfLines={2}>{item.body}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
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
  back: { color: '#4a9eff', fontSize: 16, width: 60 },
  title: { color: '#e0e0e0', fontSize: 18, fontWeight: '600' },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  date: { color: '#4a9eff', fontSize: 12, marginBottom: 4 },
  preview: { color: '#ccc', fontSize: 14, lineHeight: 20 },
});
