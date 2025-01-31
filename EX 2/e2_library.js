/* 
 * This code is provided solely for the personal and private use of students 
 * taking the CSC309H course at the University of Toronto. Copying for purposes 
 * other than this use is expressly prohibited. All forms of distribution of 
 * this code, including but not limited to public repositories on GitHub, 
 * GitLab, Bitbucket, or any other online platform, whether as given or with 
 * any changes, are expressly prohibited. 
*/ 

/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array

	const newBookName = document.querySelector('#newBookName').value
	const newBookAuthor = document.querySelector('#newBookAuthor').value
	const newBookGenre = document.querySelector('#newBookGenre').value

	newBook = new Book(newBookName, newBookAuthor, newBookGenre)

	libraryBooks.push(newBook)

	// Call addBookToLibraryTable properly to add book to the DOM

	addBookToLibraryTable(newBook)
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron

	const boookID = document.querySelector('#loanBookId').value
	const patronID = document.querySelector('#loanCardNum').value
	const book = libraryBooks[boookID]

	// Add patron to the book's patron property

	book.patron = patrons[patronID]
	
	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()

	addBookToPatronLoans(book)

	// Start the book loan timer.

	book.setLoanTime()
	
}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();

	// check if return button was clicked, otherwise do nothing.

	if (e.target.classList.contains('return')){

		const book = libraryBooks[parseInt(e.target.parentElement.parentElement.children[0].innerText)]

		removeBookFromPatronTable(book)

		book.patron = null

	}

	// Call removeBookFromPatronTable()


	// Change the book object to have a patron of 'null'


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array

	const patronName = document.querySelector('#newPatronName').value

	const newPatron = new Patron(patronName)

	patrons.push(newPatron)

	// Call addNewPatronEntry() to add patron to the DOM

	addNewPatronEntry(newPatron)

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book

	const book = libraryBooks[parseInt(document.querySelector('#bookInfoId').value)]

	// Call displayBookInfo()	

	displayBookInfo(book)

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here 

	const row = document.createElement('tr');

	const bookIdBlock = document.createElement('td');
	bookIdBlock.innerText = book.bookId


	const bookTitleBlock = document.createElement('td');
	const strong = document.createElement('strong')
	strong.innerText = book.title
	bookTitleBlock.appendChild(strong)

	const patronBlock = document.createElement('td');

	row.appendChild(bookIdBlock)
	row.appendChild(bookTitleBlock)
	row.appendChild(patronBlock)

	bookTable.children[0].appendChild(row);
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here

	const bookInfo = document.querySelector("#bookInfo")

	bookInfo.children[0].children[0].innerText = book.bookId
	bookInfo.children[1].children[0].innerText = book.title
	bookInfo.children[2].children[0].innerText = book.author
	bookInfo.children[3].children[0].innerText = book.genre
	if (book.patron == null){
		bookInfo.children[4].children[0].innerText = 'N/A'
	} else{
		bookInfo.children[4].children[0].innerText = book.patron.name
	}


}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	const patronID = book.patron.cardNumber

	const tableBody = document.querySelector('#patrons').children[patronID].children[3].children[0]

	const row = document.createElement('tr')

	const bookIdBlock = document.createElement('td')
	bookIdBlock.innerText = book.bookId

	const titleBlock = document.createElement('td')
	const strong = document.createElement('strong')
	strong.innerText = book.title
	titleBlock.appendChild(strong)

	const statusBlock = document.createElement('td')
	const span = document.createElement('span')
	span.className = 'green'
	span.innerText = 'Within due date'
	statusBlock.appendChild(span)

	const returnBlock = document.createElement('td')
	const returnButton = document.createElement('button')
	returnButton.className = 'return'
	returnButton.innerText = 'return'
	returnBlock.appendChild(returnButton)

	row.appendChild(bookIdBlock)
	row.appendChild(titleBlock)
	row.appendChild(statusBlock)
	row.appendChild(returnBlock)
	tableBody.appendChild(row)


	document.querySelector('#bookTable').children[0].children[book.bookId + 1].children[2].innerText = patronID


}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status, and Return).
function addNewPatronEntry(patron) {
	// Add code here
	const patronBlock = document.createElement('div')
	patronBlock.className = 'patron'

	const l1 = document.createElement('p')
	l1.innerText = 'Name: '
	const span1 = document.createElement('span')
	span1.className = 'bold'
	span1.innerText = patron.name
	l1.appendChild(span1)

	const l2 = document.createElement('p')
	l2.innerText = 'Card Number: '
	const span2 = document.createElement('span')
	span2.className = 'bold'
	span2.innerText = patron.cardNumber
	l2.appendChild(span2)

	const l3 = document.createElement('h4')
	l3.innerText = 'Books on loan:'

	const table = document.createElement('table')
	table.className = 'patronLoansTable'

	const tableBody = document.createElement('tbody')

	const row = document.createElement('tr')

	const block1 = document.createElement('th')
	block1.innerText = 'BookID'
	const block2 = document.createElement('th')
	block2.innerText = 'Title'
	const block3 = document.createElement('th')
	block3.innerText = 'Status'
	const block4 = document.createElement('th')
	block4.innerText = 'Return'

	row.appendChild(block1)
	row.appendChild(block2)
	row.appendChild(block3)
	row.appendChild(block4)
	tableBody.appendChild(row)
	table.appendChild(tableBody)

	patronBlock.appendChild(l1)
	patronBlock.appendChild(l2)
	patronBlock.appendChild(l3)
	patronBlock.appendChild(table)

	document.querySelector('#patrons').appendChild(patronBlock)
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const patronNumber = book.patron.cardNumber

	const patronBookList = document.querySelector('#patrons').children[patronNumber].children[3].children[0]

	for(let i = 1; i < patronBookList.children.length; i++) {
		let row = patronBookList.children[i]

		if(row.children[0].innerText == book.bookId) {
			patronBookList.removeChild(row)
			break
		}
	}

	for(let i = 1; i < bookTable.children[0].children.length; i++) {
		let row = bookTable.children[0].children[i];

		if(row.children[0].innerText == book.bookId) {
			row.children[2].innerText = '';
		}
	}


}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const patronNumber = book.patron.cardNumber

	var patronBookList = document.querySelectorAll('.patron')[patronNumber].children[3].children[0];

	for(let i =0; i < patronBookList.children.length; i++){
		row = patronBookList.children[i]
		if(row.children[0].innerText == book.bookId){
			row.children[2].children[0].className = 'red'
			row.children[2].children[0].innerText = 'Overdue'
		}
	}

}

















































