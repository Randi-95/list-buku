document.addEventListener("DOMContentLoaded", function () {
  const kirimForm = document.getElementById("bookForm");

  kirimForm.addEventListener("submit", function (event) {
    event.preventDefault();
    isiBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const checkBox = document.getElementById("bookFormIsComplete");
  const keteranganBuku = document.getElementById("keterangan-buku");

  checkBox.addEventListener("change", function () {
    keteranganBuku.innerText = checkBox.checked ? "Telah selesai" : "Belum selesai";
  });

  keteranganBuku.innerText = checkBox.checked ? "Telah selesai" : "Belum selesai";
});

function isiBook() {
  const judul = document.getElementById("bookFormTitle").value;
  const penulis = document.getElementById("bookFormAuthor").value;
  const tahun = Number(document.getElementById("bookFormYear").value);
  const keteranganSelesai = document.getElementById("bookFormIsComplete").checked;

  const membuatId = membuatID();
  const objectBook = membuatObject(membuatId, judul, penulis, tahun, keteranganSelesai);
  
  bookIsi.push(objectBook);
  document.dispatchEvent(new Event('RENDER_EVENT'));

  saveData()
}

function membuatID() {
  return +new Date();
}

function membuatObject(id, judul, penulis, tahun, keteranganSelesai) {
  return {
    id,
    title: judul,
    author: penulis,
    year: tahun,
    isComplete: keteranganSelesai
  }
}

let bookIsi = [];
const RENDER_EVENT = 'RENDER_EVENT';

document.addEventListener(RENDER_EVENT, function () {
  console.log(bookIsi);

  const bukuBelumSelesai = document.getElementById('incompleteBookList');
  bukuBelumSelesai.innerHTML = '';
  const bukuSelesai = document.getElementById('completeBookList');
  bukuSelesai.innerHTML = '';

  for (const buku of bookIsi) {
    const elementBuku = membuatBuku(buku);

    if (!buku.keteranganSelesai) {
      bukuBelumSelesai.append(elementBuku);
    } else {
      bukuSelesai.append(elementBuku);
    }
  }
});

function membuatBuku(objectBook) {
  const judulBuku = document.createElement('h3');
  judulBuku.setAttribute('data-testid', 'bookItemTitle');
  judulBuku.innerText = objectBook.title;

  const penulisBuku = document.createElement('p');
  penulisBuku.setAttribute('data-testid', 'bookItemAuthor');
  penulisBuku.innerText = objectBook.author;

  const tahunBuku = document.createElement('p');
  tahunBuku.setAttribute('data-testid', 'bookItemYear');
  tahunBuku.innerText = objectBook.year;

  const container = document.createElement('div');
  container.setAttribute('data-testid', 'bookItem');
  container.setAttribute('data-bookid', `id:${objectBook.id}`);
  container.append(judulBuku, penulisBuku, tahunBuku);

  if (objectBook.keteranganSelesai) {
    const tombolUndo = document.createElement('button');
    tombolUndo.setAttribute('data-testid', 'bookItemIsCompleteButton');
    tombolUndo.innerText = 'Belum Selesai diBaca';
    tombolUndo.addEventListener('click', function () {
      membatalkanSelesai(objectBook.id);
    });

    const tombolHapus = document.createElement('button');
    tombolHapus.setAttribute('data-testid', 'bookItemDeleteButton');
    tombolHapus.innerText = 'Hapus Buku';
    tombolHapus.addEventListener('click', function () {
      menghapusBuku(objectBook.id);
    });

    container.append(tombolUndo, tombolHapus);
  } else {
    const tombolSelesai = document.createElement('button');
    tombolSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');
    tombolSelesai.innerText = 'Selesai Dibaca';
    tombolSelesai.addEventListener('click', function () {
      menyelesaikanBuku(objectBook.id);
    });

    const tombolHapus = document.createElement('button');
    tombolHapus.setAttribute('data-testid', 'bookItemDeleteButton');
    tombolHapus.innerText = 'Hapus Buku';
    tombolHapus.addEventListener('click', function () {
      menghapusBuku(objectBook.id);
    });
    container.append(tombolSelesai, tombolHapus);
  }

  return container;
}

function mencariBuku(idBuku) {
  idBuku = Number(idBuku);
  return bookIsi.find(buku => buku.id === idBuku) || null;
}

function mencariIndexBuku(idBuku) {
  idBuku = Number(idBuku);
  return bookIsi.findIndex(buku => buku.id === idBuku);
}

function menyelesaikanBuku(idBuku) {
  const targetBuku = mencariBuku(idBuku);
  if (targetBuku === null) return;
  targetBuku.keteranganSelesai = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function membatalkanSelesai(idBuku) {
  const targetBuku = mencariBuku(idBuku);
  if (targetBuku === null) return;
  targetBuku.keteranganSelesai = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function menghapusBuku(idBuku) {
  const index = mencariIndexBuku(idBuku);
  if (index === -1) return;
  bookIsi.splice(index, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookIsi);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      bookIsi.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
