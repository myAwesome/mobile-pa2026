import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../src/api/client';
import { usePostsStore } from '../../src/store/posts';

export default function SearchScreen() {
  const router = useRouter();
  const setSelectedPost = usePostsStore((s) => s.setSelectedPost);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', search],
    queryFn: () => getPosts({ $limit: 50, search }),
    enabled: search.length > 1,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search entries..."
          placeholderTextColor="#555"
          onSubmitEditing={() => setSearch(query)}
          returnKeyType="search"
          autoFocus
        />
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
  searchRow: { padding: 12 },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  date: { color: '#4a9eff', fontSize: 12, marginBottom: 4 },
  preview: { color: '#ccc', fontSize: 14, lineHeight: 20 },
});
