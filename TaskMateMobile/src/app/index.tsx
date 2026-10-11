
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db, auth } from '../firebaseConfig';

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

type Task = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  done: boolean;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [deadline, setDeadline] = useState('');

useEffect(() => {
  async function loadTasks() {
    const user = auth.currentUser;

    if (!user) {
      setTasks([]);
      return;
    }

    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid)
        )
      );

      const data: Task[] = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Task[];

      setTasks(data);
    } catch (error) {
      console.error('Gagal memuat tugas dari Firestore:', error);
    }
  }

  loadTasks();
}, []);

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;

  // Fungsi addTask dan fungsi lainnya tetap di bawah sini.


async function toggleTask(id: string) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  try {
    await updateDoc(doc(db, 'tasks', id), {
      done: !task.done,
    });

    setTasks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !task.done } : item
      )
    );
  } catch (error) {
    Alert.alert(
      'Gagal',
      'Status tugas belum berhasil diperbarui. Periksa koneksi Firebase.'
    );
    console.error('Gagal mengubah status tugas:', error);
  }
}

async function addTask() {
  if (!title.trim() || !course.trim() || !deadline.trim()) {
    Alert.alert(
      'Data belum lengkap',
      'Isi nama tugas, mata kuliah, dan tenggat terlebih dahulu.'
    );
    return;
  }

try {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert('Belum login', 'Silakan login terlebih dahulu.');
    return;
  }

const taskData = {
  title: title.trim(),
  course: course.trim(),
  deadline: deadline.trim(),
  done: false,
  userId: user.uid,
};
    const docRef = await addDoc(collection(db, 'tasks'), taskData);

    const newTask: Task = {
      id: docRef.id,
      ...taskData,
    };

    setTasks((current) => [...current, newTask]);
    setTitle('');
    setCourse('');
    setDeadline('');
    setShowForm(false);

  } catch (error) {
    Alert.alert(
      'Gagal',
      'Tugas belum berhasil disimpan. Periksa koneksi Firebase.'
    );
    console.error('Gagal menambahkan tugas:', error);
  }
}

async function deleteTask(id: string) {
  try {
    await deleteDoc(doc(db, 'tasks', id));

    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  } catch (error) {
    Alert.alert(
      'Gagal',
      'Tugas belum berhasil dihapus. Periksa koneksi Firebase.'
    );
    console.error('Gagal menghapus tugas:', error);
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>HALO, MAHASISWA!</Text>
            <Text style={styles.heading}>TaskMate</Text>
            <Text style={styles.subtitle}>
              Atur tugasmu, capai targetmu.
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TM</Text>
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            Tetap produktif hari ini!
          </Text>
          <Text style={styles.bannerSubtitle}>
            Satu tugas selesai, satu langkah lebih maju.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ringkasan Tugas</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.blueCard]}>
            <Text style={styles.summaryNumber}>{tasks.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>

          <View style={[styles.summaryCard, styles.orangeCard]}>
            <Text style={styles.summaryNumber}>{pending}</Text>
            <Text style={styles.summaryLabel}>Belum selesai</Text>
          </View>

          <View style={[styles.summaryCard, styles.greenCard]}>
            <Text style={styles.summaryNumber}>{completed}</Text>
            <Text style={styles.summaryLabel}>Selesai</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm((current) => !current)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            {showForm ? 'Tutup Formulir' : '+ Tambah Tugas'}
          </Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Tugas Baru</Text>

            <Text style={styles.inputLabel}>Nama tugas</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Membuat laporan"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Mata kuliah</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Mobile Programming"
              placeholderTextColor="#94A3B8"
              value={course}
              onChangeText={setCourse}
            />

            <Text style={styles.inputLabel}>Tenggat tugas</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 20 Oktober 2026"
              placeholderTextColor="#94A3B8"
              value={deadline}
              onChangeText={setDeadline}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={addTask}
            >
              <Text style={styles.saveButtonText}>Simpan Tugas</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daftar Tugas</Text>
          <Text style={styles.taskCount}>{pending} tersisa</Text>
        </View>

        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Belum ada tugas</Text>
            <Text style={styles.subtitle}>
              Tekan Tambah Tugas untuk memulai.
            </Text>
          </View>
        )}

        {tasks.map((task) => (
          <View
            key={task.id}
            style={[styles.taskCard, task.done && styles.completedCard]}
          >
            <View style={styles.taskTop}>
              <View style={styles.taskInfo}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.done && styles.completedText,
                  ]}
                >
                  {task.title}
                </Text>

                <Text style={styles.course}>{task.course}</Text>
                <Text style={styles.deadline}>
                  Tenggat: {task.deadline}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  task.done ? styles.doneBadge : styles.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    task.done ? styles.doneText : styles.pendingText,
                  ]}
                >
                  {task.done ? 'Selesai' : 'Berjalan'}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  task.done && styles.undoButton,
                ]}
                onPress={() => toggleTask(task.id)}
              >
                <Text
                  style={[
                    styles.actionText,
                    task.done && styles.undoText,
                  ]}
                >
                  {task.done ? 'Batalkan selesai' : 'Tandai selesai'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(task.id)}
              >
                <Text style={styles.deleteText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>TASKMATE • TEMAN PRODUKTIFMU</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  content: {
    padding: 22,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  heading: {
    color: '#172554',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 5,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 5,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#DCEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: '800',
  },
  banner: {
    backgroundColor: '#2449A5',
    borderRadius: 22,
    padding: 22,
    marginBottom: 28,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  bannerSubtitle: {
    color: '#DCE7FF',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#172554',
    fontSize: 19,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 17,
  },
  blueCard: {
    backgroundColor: '#DBEAFE',
  },
  orangeCard: {
    backgroundColor: '#FFEDD5',
  },
  greenCard: {
    backgroundColor: '#D1FAE5',
  },
  summaryNumber: {
    color: '#172554',
    fontSize: 26,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#2449A5',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
  },
  formTitle: {
    color: '#172554',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
    color: '#172554',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  taskCount: {
    color: '#64748B',
    fontSize: 12,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  taskTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  completedText: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  course: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 7,
  },
  deadline: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 7,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  doneBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  pendingText: {
    color: '#92400E',
  },
  doneText: {
    color: '#047857',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2449A5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  undoButton: {
    backgroundColor: '#DCFCE7',
  },
  undoText: {
    color: '#166534',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 18,
  },
  emptyTitle: {
    color: '#172554',
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 22,
  },
});
