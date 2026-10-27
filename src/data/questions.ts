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
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Penjaga Alun-alun (Town Guard)',
    dialogueIntro: 'Halo Prajurit! Lihat bendera kerajaan di depan gerbang istana.',
    question: 'The flag is ________ the gate.',
    options: [
      'in front of',
      'under',
      'behind'
    ],
    correctIndex: 0,
    explanation: '"In front of" artinya di depan. Bendera ada di depan gerbang.',
    clueText: 'Penjaga: "Pintar! Periksa keranjang buah di meja pasar ya!"'
  },
  {
    id: 'q_numbers',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Keranjang Buah (Fruit Basket)',
    dialogueIntro: 'Ada keranjang apel merah segar di atas meja kayu.',
    question: 'The apples are ________ the table.',
    options: [
      'under',
      'on',
      'behind'
    ],
    correctIndex: 1,
    explanation: '"On" artinya di atas. Apel ada di atas meja.',
    clueText: 'Petunjuk: Tukang Kebun Rama ada di Taman Bunga sebelah timur!'
  },
  {
    id: 'q_hobbies',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Tukang Kebun Rama (Gardener)',
    dialogueIntro: 'Hai! Aku sedang menyiram bunga di samping air mancur.',
    question: 'The flowers are ________ the fountain.',
    options: [
      'next to',
      'under',
      'on'
    ],
    correctIndex: 0,
    explanation: '"Next to" artinya di samping atau di sebelah.',
    clueText: 'Rama: "Lihat anak kucing lucu yang sedang tidur di taman!"'
  },
  {
    id: 'q_there_is',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Kucing Taman (Garden Cat)',
    dialogueIntro: 'Ada anak kucing oranye manis sedang tidur santai di bawah pohon.',
    question: 'Where is the cat?',
    options: [
      'It is under the tree.',
      'It is on the tree.',
      'It is behind the tree.'
    ],
    correctIndex: 0,
    explanation: '"Under" artinya di bawah. Kucing ada di bawah pohon ("under the tree").',
    clueText: 'Petunjuk: Periksa tas sekolah di gazebo taman!'
  },
  {
    id: 'q_preposition',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Meja Belajar Gazebo (Study Desk)',
    dialogueIntro: 'Di gazebo taman, ada tas sekolah di bawah meja belajar.',
    question: 'Where is the bag?',
    options: [
      'It is on the table.',
      'It is under the table.',
      'It is behind the table.'
    ],
    correctIndex: 1,
    explanation: '"Under" artinya di bawah. Tas ada di bawah meja ("under the table").',
    clueText: 'Catatan di tas: "Koki Budi ada di Dapur Istana sebelah utara!"'
  },
  {
    id: 'q_meals',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Koki Istana Budi (Chef)',
    dialogueIntro: 'Koki Budi sedang memasak sup hangat di depan kompor dapur.',
    question: 'The chef is ________ the stove.',
    options: [
      'in front of',
      'under',
      'behind'
    ],
    correctIndex: 0,
    explanation: '"In front of" artinya di depan. Koki berdiri di depan kompor.',
    clueText: 'Koki Budi: "Kunci Hutan ada di wastafel dapur!"'
  },
  {
    id: 'q_kitchen_activities',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Wastafel Dapur (Kitchen Sink)',
    dialogueIntro: 'Piring-piring perak istana ditaruh di dalam wastafel.',
    question: 'The plates are ________ the sink.',
    options: [
      'behind',
      'under',
      'in'
    ],
    correctIndex: 2,
    explanation: '"In" artinya di dalam. Piring ada di dalam wastafel.',
    clueText: 'Kamu menemukan Kunci Hutan Rahasia! Periksa ruang tamu istana!'
  },
  {
    id: 'q_living_room',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Ruang Tamu Istana (Living Room)',
    dialogueIntro: 'Ada lukisan besar raja di dinding, tepat di belakang sofa.',
    question: 'The picture is ________ the sofa.',
    options: [
      'under',
      'behind',
      'in front of'
    ],
    correctIndex: 1,
    explanation: '"Behind" artinya di belakang. Lukisan ada di belakang sofa.',
    clueText: 'Tetua Istana: "Pergilah ke Gerbang Hutan di selatan!"'
  },
  {
    id: 'q_transportation',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Penjaga Gerbang (Gatekeeper)',
    dialogueIntro: 'Penjaga berdiri tegap di samping gerbang besi hutan.',
    question: 'The guard is ________ the gate.',
    options: [
      'next to',
      'under',
      'on'
    ],
    correctIndex: 0,
    explanation: '"Next to" artinya di samping. Penjaga berdiri di samping gerbang.',
    clueText: 'Penjaga: "Pintu dibuka! Kalahkan monster dan ambil Mahkota Bintang!"'
  },
  {
    id: 'q_present_continuous',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Prasasti Kuno (Ancient Tablet)',
    dialogueIntro: 'Prasasti kuno menunjukkan letak Mahkota Bintang di atas altar emas.',
    question: 'The crown is ________ the altar.',
    options: [
      'under',
      'on',
      'behind'
    ],
    correctIndex: 1,
    explanation: '"On" artinya di atas. Mahkota berada di atas altar emas.',
    clueText: 'Prasasti bersinar! Mahkota Bintang siap diambil di atas altar!'
  }
];

export function getQuestionById(id: string): QuestionItem | undefined {
  return EDUCATIONAL_QUESTIONS.find(q => q.id === id);
}
