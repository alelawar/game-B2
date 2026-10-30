export interface QuestionItem {
  id: string;
  topic: string;
  gradeLevel: '3' | '4' | '3-4';
  contextTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  dialogueIntro: string;
  clueText: string;
  icon?: string;
}

export const EDUCATIONAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'q_likes',
    topic: 'Likes & Dislikes',
    gradeLevel: '3',
    contextTitle: 'Penjaga Alun-alun (Town Guard)',
    dialogueIntro: 'Penjaga Alun-alun sangat suka makan apel merah yang manis setiap pagi.',
    question: 'The guard eats sweet red apples every morning. He ________ apples.',
    options: [
      'likes',
      'dislikes',
      'don\'t like'
    ],
    correctIndex: 0,
    explanation: 'Karena subjeknya tunggal (He) dan dia menyukai apel, kita menggunakan "likes".',
    clueText: 'Penjaga: "Pintar! Periksa keranjang buah di meja pasar ya!"'
  },
  {
    id: 'q_numbers',
    topic: 'Yes / No (Likes & Dislikes)',
    gradeLevel: '3',
    contextTitle: 'Keranjang Buah (Fruit Basket)',
    dialogueIntro: 'Di keranjang hanya ada apel. Putri Cahaya tidak suka buah durian karena baunya menyengat.',
    question: 'Princess Cahaya does not eat durian. Does she like durian?',
    options: [
      'Yes, she does.',
      'No, she doesn\'t.',
      'Yes, I do.'
    ],
    correctIndex: 1,
    explanation: 'Pertanyaan "Does she like...?" untuk hal yang tidak disukai dijawab "No, she doesn\'t."',
    clueText: 'Petunjuk: Tukang Kebun Rama ada di Taman Bunga sebelah timur!'
  },
  {
    id: 'q_hobbies',
    topic: 'Likes & Dislikes',
    gradeLevel: '3',
    contextTitle: 'Tukang Kebun Rama (Gardener)',
    dialogueIntro: 'Tukang Kebun Rama senang merawat bunga, tetapi ia tidak suka ulat yang merusak daun.',
    question: 'Rama is sad when caterpillars eat his flowers. He ________ caterpillars.',
    options: [
      'doesn\'t like',
      'likes',
      'don\'t like'
    ],
    correctIndex: 0,
    explanation: 'Untuk subjek "He" (tunggal), bentuk negatif (tidak suka) adalah "doesn\'t like".',
    clueText: 'Rama: "Lihat anak kucing lucu yang sedang minum susu di taman!"'
  },
  {
    id: 'q_there_is',
    topic: 'Yes / No (Likes & Dislikes)',
    gradeLevel: '3',
    contextTitle: 'Kucing Taman (Garden Cat)',
    dialogueIntro: 'Anak kucing oranye di taman sedang meminum susu hangat dengan sangat lahap!',
    question: 'The cat drinks the warm milk happily. Does the cat like milk?',
    options: [
      'Yes, it does.',
      'No, it doesn\'t.',
      'No, I don\'t.'
    ],
    correctIndex: 0,
    explanation: 'Kucing (it) menyukai susu hangat, sehingga dijawab "Yes, it does."',
    clueText: 'Petunjuk: Periksa meja belajar di gazebo taman!'
  },
  {
    id: 'q_preposition',
    topic: 'Likes & Dislikes',
    gradeLevel: '3',
    contextTitle: 'Meja Belajar Gazebo (Study Desk)',
    dialogueIntro: 'Di meja belajar ada banyak buku cerita. Anak-anak kerajaan suka membaca buku bersama.',
    question: 'The children read storybooks happily every day. They ________ reading books.',
    options: [
      'doesn\'t like',
      'like',
      'dislikes'
    ],
    correctIndex: 1,
    explanation: 'Untuk subjek jamak "They" (mereka), kata kerja yang tepat adalah "like" (tanpa -s).',
    clueText: 'Catatan di meja: "Koki Budi ada di Dapur Istana sebelah utara!"'
  },
  {
    id: 'q_meals',
    topic: 'Yes / No (Likes & Dislikes)',
    gradeLevel: '3',
    contextTitle: 'Koki Istana Budi (Chef)',
    dialogueIntro: 'Koki Budi tersenyum senang: "Aku sangat suka memasak sup ayam hangat!"',
    question: 'Chef Budi says, "I love cooking chicken soup!" Do you like chicken soup, Chef?',
    options: [
      'Yes, I do.',
      'No, I don\'t.',
      'No, he doesn\'t.'
    ],
    correctIndex: 0,
    explanation: 'Pertanyaan "Do you like...?" jika suka dijawab dengan "Yes, I do."',
    clueText: 'Koki Budi: "Kunci Hutan ada di wastafel dapur!"'
  },
  {
    id: 'q_kitchen_activities',
    topic: 'Likes & Dislikes',
    gradeLevel: '3',
    contextTitle: 'Wastafel Dapur (Kitchen Sink)',
    dialogueIntro: 'Para koki selalu mencuci piring sampai bersih. Mereka tidak suka dapur yang kotor.',
    question: 'The chefs always keep the kitchen clean. They ________ a dirty kitchen.',
    options: [
      'likes',
      'like',
      'don\'t like'
    ],
    correctIndex: 2,
    explanation: 'Untuk subjek "They" (mereka), bentuk tidak suka adalah "don\'t like".',
    clueText: 'Kamu menemukan Kunci Hutan Rahasia! Periksa juga ruang tamu istana!'
  },
  {
    id: 'q_living_room',
    topic: 'Yes / No (Likes & Dislikes)',
    gradeLevel: '3',
    contextTitle: 'Ruang Tamu Istana (Living Room)',
    dialogueIntro: 'Di meja ruang tamu ada teh manis. Raja tidak suka minum kopi karena terlalu pahit.',
    question: 'The King never drinks bitter coffee. Does the King like bitter coffee?',
    options: [
      'Yes, he does.',
      'No, he doesn\'t.',
      'Yes, she does.'
    ],
    correctIndex: 1,
    explanation: 'Karena Raja (He) tidak suka kopi pahit, jawaban yang tepat adalah "No, he doesn\'t."',
    clueText: 'Tetua Istana: "Pergilah ke Gerbang Hutan di selatan!"'
  },
  {
    id: 'q_transportation',
    topic: 'Yes / No (Likes & Dislikes)',
    gradeLevel: '3',
    contextTitle: 'Penjaga Gerbang (Gatekeeper)',
    dialogueIntro: 'Penjaga Gerbang berkata tegas: "Aku tidak suka monster jahat yang mencuri mahkota!"',
    question: 'Gatekeeper: "I hate the bad monsters!" Do you like the monsters, Gatekeeper?',
    options: [
      'No, I don\'t.',
      'Yes, I do.',
      'Yes, he does.'
    ],
    correctIndex: 0,
    explanation: 'Penjaga tidak menyukai monster, maka jawaban "Do you like...?" adalah "No, I don\'t."',
    clueText: 'Penjaga: "Pintu dibuka! Kalahkan monster dan ambil Mahkota Bintang!"'
  },
  {
    id: 'q_present_continuous',
    topic: 'Likes & Dislikes',
    gradeLevel: '3',
    contextTitle: 'Prasasti Kuno (Ancient Tablet)',
    dialogueIntro: 'Prasasti kuno menceritakan bahwa Putri Cahaya sangat menyukai Mahkota Bintang yang berkilau.',
    question: 'Princess Cahaya loves the shining Star Crown very much. She ________ the Star Crown.',
    options: [
      'doesn\'t like',
      'likes',
      'don\'t like'
    ],
    correctIndex: 1,
    explanation: 'Karena Putri Cahaya (She) sangat menyukai Mahkota Bintang, gunakan "likes".',
    clueText: 'Prasasti bersinar! Mahkota Bintang siap diambil di atas altar!'
  }
];

export function getQuestionById(id: string): QuestionItem | undefined {
  return EDUCATIONAL_QUESTIONS.find(q => q.id === id);
}
