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
    topic: 'Likes and Dislikes',
    gradeLevel: '3',
    contextTitle: 'Penjaga Alun-alun (Town Guard)',
    dialogueIntro: 'Halo Prajurit! Sebelum kamu menjelajah desa, aku ingin menguji sapaanmu. Dengarkan baik-baik!',
    question: 'Do you like fried chicken?',
    options: [
      'Yes, I do.',
      'Yes, I am.',
      'No, I can\'t.'
    ],
    correctIndex: 0,
    explanation: 'Jawaban yang tepat untuk pertanyaan "Do you like...?" adalah "Yes, I do" atau "No, I don\'t".',
    clueText: 'Penjaga Alun-alun berkata: "Prajurit yang sopan selalu tahu cara menjawab pertanyaan dengan benar!"'
  },
  {
    id: 'q_numbers',
    topic: 'Numbers (1–50)',
    gradeLevel: '3',
    contextTitle: 'Keranjang Buah Alun-alun (Fruit Basket)',
    dialogueIntro: 'Kamu melihat keranjang buah segar milik pedagang istana. Ada label bertuliskan jumlah apel di keranjang!',
    question: 'There are 25 sweet red apples in the basket. How do you write 25 in English words?',
    options: [
      'Twelve',
      'Twenty-five',
      'Fifty-two'
    ],
    correctIndex: 1,
    explanation: 'Angka 25 dalam bahasa Inggris dieja "Twenty-five" (20 = twenty, 5 = five).',
    clueText: 'Petunjuk: Pedagang pasar bilang ia melihat jejak monster lari ke arah Taman Kerajaan di sebelah timur!'
  },
  {
    id: 'q_hobbies',
    topic: 'Hobbies',
    gradeLevel: '3',
    contextTitle: 'Tukang Kebun Rama (Gardener)',
    dialogueIntro: 'Hai prajurit cilik! Aku sedang merawat bunga mawar. Di waktu luang, aku suka berenang di danau istana.',
    question: 'Rama loves spending his free time swimming in the lake. What is his hobby?',
    options: [
      'My hobby is swimming.',
      'My hobby is cycling.',
      'My hobby is reading books.'
    ],
    correctIndex: 0,
    explanation: 'Berenang di air adalah "swimming". Kalimat menyatakan hobi adalah "My hobby is swimming."',
    clueText: 'Tukang Kebun Rama berbisik: "Kucing istana tadi melihat makhluk berkilau lewat di dekat air mancur taman!"'
  },
  {
    id: 'q_there_is',
    topic: 'There is / There are',
    gradeLevel: '4',
    contextTitle: 'Patung Kucing Taman (Garden Fountain)',
    dialogueIntro: 'Di sebelah air mancur taman, kamu melihat seekor anak kucing oranye sedang tidur manis di rerumputan.',
    question: 'Complete the sentence: "________ a cute cat sleeping in the garden."',
    options: [
      'There are',
      'There am',
      'There is'
    ],
    correctIndex: 2,
    explanation: '"There is" digunakan untuk benda/hewan tunggal (a cat), sedangkan "There are" untuk benda jamak (lebih dari satu).',
    clueText: 'Di bawah patung kucing ada ukiran kuno: "Kunci Hutan Rahasia disimpan di Dapur Istana sebelah utara!"'
  },
  {
    id: 'q_preposition',
    topic: 'Prepositions of Place',
    gradeLevel: '3',
    contextTitle: 'Meja Belajar Taman (Gazebo Study Desk)',
    dialogueIntro: 'Di gazebo taman ada meja kayu. Sebuah tas sekolah tertata rapi tepat di bagian bawah meja.',
    question: 'The royal school bag is located underneath the study table. Where is the bag?',
    options: [
      'It is on the table.',
      'It is under the table.',
      'It is behind the table.'
    ],
    correctIndex: 1,
    explanation: '"Under" berarti di bawah. Jadi "It is under the table" menunjukkan posisi tas berada di bawah meja.',
    clueText: 'Di dalam tas ada catatan: "Koki Istana suka membuat makan siang pada jam 12 siang. Temui dia di Dapur Istana!"'
  },
  {
    id: 'q_meals',
    topic: 'Meals and Meal Times',
    gradeLevel: '3',
    contextTitle: 'Koki Istana Budi (Royal Chef)',
    dialogueIntro: 'Aroma masakan lezat tercium! Jam dinding besar istana menunjukkan pukul 12 siang (12 p.m.). Koki Budi sedang menyiapkan hidangan hangat.',
    question: 'The royal clock strikes 12:00 p.m. noon. Which meal is being served right now?',
    options: [
      'We eat lunch at 12 p.m.',
      'We have breakfast at 12 p.m.',
      'We eat dinner at 12 p.m.'
    ],
    correctIndex: 0,
    explanation: 'Makan siang pada pukul 12 siang disebut "lunch". "Breakfast" adalah sarapan pagi, sedangkan "dinner" adalah makan malam.',
    clueText: 'Koki Budi tersenyum: "Hebat! Silakan periksa wastafel dapur jika ingin mencari kunci gerbang hutan!"'
  },
  {
    id: 'q_kitchen_activities',
    topic: 'Kitchen Activities & Modal "can"',
    gradeLevel: '4',
    contextTitle: 'Wastafel Dapur Istana (Kitchen Sink)',
    dialogueIntro: 'Piring-piring perak istana baru saja selesai digunakan. Koki meminta bantuan prajurit untuk membersihkannya.',
    question: 'Complete the sentence: "We can wash the dirty plates in the ________."',
    options: [
      'stove',
      'refrigerator',
      'sink'
    ],
    correctIndex: 2,
    explanation: 'Tempat mencuci piring di dapur adalah wastafel/bak cuci piring ("sink"). "Stove" adalah kompor dan "refrigerator" adalah kulkas.',
    clueText: 'Di dekat wastafel kamu menemukan Kristal Kunci Hutan! Bawalah ke ruang tamu untuk menemui Tetua Istana!'
  },
  {
    id: 'q_living_room',
    topic: 'Living Room Objects',
    gradeLevel: '4',
    contextTitle: 'Ruang Tamu Istana (Castle Living Room)',
    dialogueIntro: 'Ruang tamu istana dihiasi karpet beludru merah dan perabot megah yang nyaman untuk duduk bersama keluarga kerajaan.',
    question: 'Which comfortable furniture is used for people to sit together in the living room?',
    options: [
      'Curtain',
      'Sofa',
      'Stove'
    ],
    correctIndex: 1,
    explanation: '"Sofa" adalah tempat duduk empuk di ruang tamu (living room). "Curtain" adalah tirai/gorden, dan "Stove" adalah kompor dapur.',
    clueText: 'Tetua Istana di sofa berkata: "Gerbang Hutan Rahasia di selatan kini terbuka! Tapi waspadalah pada Penjaga Gerbang!"'
  },
  {
    id: 'q_transportation',
    topic: 'Transportation to School',
    gradeLevel: '4',
    contextTitle: 'Penjaga Gerbang Hutan (Forest Gatekeeper)',
    dialogueIntro: 'Penjaga berzirah besi menghalangi pintu gerbang Hutan Rahasia. Ia ingin memastikan prajurit yang lewat adalah anak yang cerdas!',
    question: 'Edo pedals his two-wheeled vehicle to school every morning. How does he go to school?',
    options: [
      'He goes to school by bike.',
      'He goes to school by bus.',
      'He goes to school by train.'
    ],
    correctIndex: 0,
    explanation: '"Bike" (atau bicycle) berarti sepeda. Kalimat yang tepat adalah "He goes to school by bike."',
    clueText: 'Penjaga Gerbang membuka palang pintu: "Silakan lewat! Monster Pencuri Mahkota ada di altar hutan terdalam. Kalahkan dia!"'
  },
  {
    id: 'q_present_continuous',
    topic: 'Present Continuous Tense',
    gradeLevel: '4',
    contextTitle: 'Prasasti Kuno Hutan (Ancient Forest Tablet)',
    dialogueIntro: 'Di depan Altar Mahkota Bintang, sebuah batu bertuliskan mantra kuno bercahaya emas. Kamu harus melengkapi mantranya!',
    question: 'Look at the carving! "Look! Made is in the field with a soccer ball. He ________ playing football right now."',
    options: [
      'are',
      'is',
      'am'
    ],
    correctIndex: 1,
    explanation: 'Untuk subjek tunggal orang ketiga ("He"), bentuk to be dalam Present Continuous adalah "is" (He is playing).',
    clueText: 'Cahaya prasasti bersinar terang! Monster Pelindung melemah dan Mahkota Bintang muncul di altar!'
  }
];

export function getQuestionById(id: string): QuestionItem | undefined {
  return EDUCATIONAL_QUESTIONS.find(q => q.id === id);
}
