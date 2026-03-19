import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPosts, Post } from '../../../src/api/client';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Fetch recent posts and find the one matching id
  // In a real impl, we'd have GET /posts/:id endpoint
  const { data, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await getPosts({ $limit: 1 });
      return res;
    },
    enabled: !!id,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: '/(app)/compose', params: { id } })}>
          <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#4a9eff" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.postId}>Post #{id}</Text>
          {/* Full post viewer would render body, periods, labels, comments */}
          <Text style={styles.placeholder}>Loading post details...</Text>
        </ScrollView>
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
  back: { color: '#4a9eff', fontSize: 16 },
  editBtn: { color: '#4a9eff', fontSize: 16 },
  scroll: { flex: 1 },
  content: { padding: 20 },
  postId: { color: '#555', fontSize: 12, marginBottom: 12 },
  placeholder: { color: '#aaa', fontSize: 16, lineHeight: 24 },
});
