import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePostsStore } from '../../../src/store/posts';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const post = usePostsStore((s) => s.selectedPost);

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

      {post ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.date}>{post.date.slice(0, 10)}</Text>

          {post.periods.length > 0 && (
            <View style={styles.tagRow}>
              {post.periods.map((p) => (
                <View key={p.id} style={styles.periodTag}>
                  <Text style={styles.periodText}>{p.name}</Text>
                </View>
              ))}
            </View>
          )}

          {post.labels.length > 0 && (
            <View style={styles.tagRow}>
              {post.labels.map((l) => (
                <View key={l.id} style={styles.labelTag}>
                  <Text style={styles.labelText}>{l.name}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.body}>{post.body}</Text>

          {post.comments.length > 0 && (
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Comments ({post.comments.length})</Text>
              {post.comments.map((c) => (
                <View key={c.id} style={styles.comment}>
                  <Text style={styles.commentDate}>{c.date.slice(0, 10)}</Text>
                  <Text style={styles.commentBody}>{c.body}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : null}
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
  date: { color: '#555', fontSize: 12, marginBottom: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  periodTag: { backgroundColor: '#1a2a1a', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  periodText: { color: '#6abf6a', fontSize: 12 },
  labelTag: { backgroundColor: '#1a1a2a', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  labelText: { color: '#6a9abf', fontSize: 12 },
  body: { color: '#e0e0e0', fontSize: 16, lineHeight: 26, marginTop: 8 },
  commentsSection: { marginTop: 32, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 16 },
  commentsTitle: { color: '#555', fontSize: 12, marginBottom: 12 },
  comment: { marginBottom: 16 },
  commentDate: { color: '#555', fontSize: 11, marginBottom: 4 },
  commentBody: { color: '#aaa', fontSize: 14, lineHeight: 20 },
});
