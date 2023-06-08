import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

// Display the initial set of books on the page
const starting = document.createDocumentFragment()

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    starting.appendChild(element)
}

document.querySelector('[data-list-items]').appendChild(starting)

// Generate the dropdown options
const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    genreHtml.appendChild(element)
}

document.querySelector('[data-search-genres]').appendChild(genreHtml)

// Generate the dropdown options for authors
const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}

/*
document.querySelector('[data-search-authors]').appendChild(authorsHtml)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}
*/

// Set up event listeners

// Set the text and disabled state of the list button
document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

// Set the HTML content of the list button including the remaining count
document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`
// Add event listener to hide search overlay when cancel button is clicked
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

// Add event listener to hide settings overlay when cancel button is clicked
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

// Add event listener to show search overlay when search button in header is clicked
document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

// Add event listener to show settings overlay when settings button in header is clicked
document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})
// Add event listener to hide active list overlay when close button is clicked
document.querySelector('[data-list-close]').addEventListener('click', () => {
  document.querySelector('[data-list-active]').open = false
})

// Add event listener to settings form submission to update theme
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const { theme } = Object.fromEntries(formData)

  // Set theme based on selected value
  if (theme === 'night') {
      document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
      document.documentElement.style.setProperty('--color-light', '10, 10, 20');
  } else {
      document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
      document.documentElement.style.setProperty('--color-light', '255, 255, 255');
  }
  
  document.querySelector('[data-settings-overlay]').open = false
})

// Add event listener to search form submission to filter books
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const filters = Object.fromEntries(formData)
  const result = []

  // Apply filters to books and create a new result array
  for (const book of books) {
      let genreMatch = filters.genre === 'any'

      for (const singleGenre of book.genres) {
          if (genreMatch) break;
          if (singleGenre === filters.genre) { genreMatch = true }
      }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }
// Update page and matches with filtered results
page = 1;
matches = result

// Show or hide list message based on the result length
if (result.length < 1) {
    document.querySelector('[data-list-message]').classList.add('list__message_show')
} else {
    document.querySelector('[data-list-message]').classList.remove('list__message_show')
}

// Clear the list items and create a new fragment for the filtered books
document.querySelector('[data-list-items]').innerHTML = ''
const newItems = document.createDocumentFragment()

// Iterate over the filtered books and create preview elements
for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    // Set the HTML content of the preview element
    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    newItems.appendChild(element)
}

// Append the new preview elements to the list
document.querySelector('[data-list-items]').appendChild(newItems)

// Disable or enable the list button based on remaining matches
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

// Update the HTML content of the list button, including the remaining count
document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

// Scroll to the top of the page smoothly
window.scrollTo({top: 0, behavior: 'smooth'});

// Hide the search overlay
document.querySelector('[data-search-overlay]').open = false
})

// Add event listener to the list button for loading more books
document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    // Iterate over the matches and create preview elements for the next page
    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)

        // Set the HTML content of the preview element
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    // Append the new preview elements to the list
    document.querySelector('[data-list-items]').appendChild(fragment)

    // Increment the page counter
    page += 1
})

// Add event listener to the list items for showing the active book details
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
  const pathArray = Array.from(event.path || event.composedPath())
  let active = null

  // Find the clicked preview element and retrieve the corresponding book
  for (const node of pathArray) {
      if (active) break

      if (node?.dataset?.preview) {
          let result = null

          // Iterate over the books to find the matching book based on the preview dataset
          for (const singleBook of books) {
              if (result) break;
              if (singleBook.id === node?.dataset?.preview) result = singleBook
          }

          active = result
      }
  }

  // If an active book is found, update the active book details in the list
  if (active) {
      document.querySelector('[data-list-active]').open = true
      document.querySelector('[data-list-blur]').src = active.image
      document.querySelector('[data-list-image]').src = active.image
      document.querySelector('[data-list-title]').innerText = active.title
      document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
      document.querySelector('[data-list-description]').innerText = active.description
  }
})
