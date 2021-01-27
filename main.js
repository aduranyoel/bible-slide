let
    cache = {},
    currentVerse = '';
const
    books = document.getElementById('books'),
    submit = document.getElementById('submit'),
    index = ["Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio", "Josué", "Jueces", "Rut", "1 Samuel", "2 Samuel", "1 Reyes", "2 Reyes", "1 Crónicas", "2 Crónicas", "Esdras", "Nehemías", "Ester", "Job", "Salmos", "Proverbios", "Eclesiastés", "Cantares", "Isaías", "Jeremías", "Lamentaciones", "Ezequiel", "Daniel", "Oseas", "Joel", "Amós", "Abdías", "Jonás", "Miqueas", "Nahúm", "Habacuc", "Sofonías", "Hageo", "Zacarías", "Malaquías", "San Mateo", "San Marcos", "San Lucas", "San Juan", "Hechos", "Romanos", "1 Corintios", "2 Corintios", "Gálatas", "Efesios", "Filipenses", "Colosenses", "1 Tesalonicenses", "2 Tesalonicenses", "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos", "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas", "Apocalipsis"];

async function getBooks() {
    try {
        const res = await fetch('./bible.json');
        return await res.json();
    } catch (e) {
        return null;
    }
}

function sendToDisplay(e) {
    e.preventDefault();
    const
        book = submit.books.getAttribute('data-value') || 1,
        chapter = Math.abs(submit.chapters.value) || 1,
        verse = Math.abs(submit.verse.value) || 1;
    findVerse(`${book}.${chapter}.${verse}`);
}

function findVerse(toFind) {
    const [book, chapter, verse] = toFind.split('.');
    if (!book || !chapter || !verse) return;
    if (cache?.[book]?.[chapter]?.[verse]) {
        processVerse(cache[book][chapter][verse], book, chapter, verse);
    }
}

function processVerse(res, book, chapter, verse) {
    currentVerse = `${book}.${chapter}.${verse}`;
    sendResult(res, book, chapter, verse);
}

function sendResult(content, book, chapter, verse) {
    let contentBody = content || '';
    if (book && chapter && verse && cache[book])
        contentBody += `<p class="site">${index[+book - 1]} ${chapter}:${verse}</p>`;
    document.getElementById('result').innerHTML = contentBody;
}

function navigate(action) {
    if (!currentVerse) return;
    const [book, chapter, verse] = currentVerse.split('.');
    const move = action === 'next' ? +verse + 1 : +verse - 1;
    findVerse(`${book}.${chapter}.${move}`);
}

submit.addEventListener('submit', sendToDisplay);

window.onload = async () => {
    const response = await getBooks();
    if (response) {
        cache = response;
        document.body.classList.remove('loading');
        books.focus();
    }
};

window.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) navigate('previous');
    if (e.keyCode === 39) navigate('next');
});

autocomplete(books, index.map((b, i) => ({name: b, value: i + 1})));
