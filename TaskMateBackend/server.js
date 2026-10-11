
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Data tugas sementara
let tasks = [
  {
    id: 1,
    title: 'Membuat aplikasi mobile',
    course: 'Mobile Programming',
    deadline: '12 Oktober 2026',
    done: false,
  },
  {
    id: 2,
    title: 'Menyelesaikan laporan praktikum',
    course: 'Sistem Operasi',
    deadline: '14 Oktober 2026',
    done: false,
  },
];

// Halaman utama API
app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di TaskMate API!',
  });
});

// Mengambil semua tugas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Menambahkan tugas
app.post('/api/tasks', (req, res) => {
  const { title, course, deadline } = req.body;

  if (!title || !course || !deadline) {
    return res.status(400).json({
      message: 'Nama tugas, mata kuliah, dan tenggat wajib diisi.',
    });
  }

  const newTask = {
    id: Date.now(),
    title,
    course,
    deadline,
    done: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Mengubah status tugas
app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({
      message: 'Tugas tidak ditemukan.',
    });
  }

  if (typeof req.body.done === 'boolean') {
    task.done = req.body.done;
  }

  res.json(task);
});

// Menghapus tugas
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const existingLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length === existingLength) {
    return res.status(404).json({
      message: 'Tugas tidak ditemukan.',
    });
  }

  res.json({
    message: 'Tugas berhasil dihapus.',
  });
});

// Menjalankan server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TaskMate API berjalan di http://localhost:${PORT}`);
});
