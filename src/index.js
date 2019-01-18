document.addEventListener("DOMContentLoaded", function(event) {
  const quotesUrl = `http://localhost:3000/quotes`
  const quoteList = document.querySelector("#quote-list")
  const newQuoteForm = document.querySelector("#new-quote-form")

  fetch(quotesUrl)
  .then(response => response.json())
  .then(addAllQuote)

  //probably does not need own function
  function addAllQuote(quotesObject){
    quotesObject.forEach(function(quote){
      quoteList.innerHTML += addSingleQuote(quote)
    })
  }

  function addSingleQuote(quoteObj){
    return `
      <li class='quote-card' data-quote-id=${quoteObj.id}>
        <blockquote class="blockquote">
          <p class="mb-0">${quoteObj.quote}</p>
          <footer class="blockquote-footer">${quoteObj.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quoteObj.likes}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      </li>
    `
  }

  newQuoteForm.addEventListener("submit",function(event){
    event.preventDefault()
    const newQuote = document.querySelector("#new-quote").value
    const newauthor = document.querySelector("#author").value

    fetch(quotesUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        quote: newQuote,
        author: newauthor,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(quote => quoteList.innerHTML += addSingleQuote(quote))
    newQuoteForm.reset()//optimistic reset
  })

  function deleteQuote(removedObj){
    const removeElement = document.querySelector(`[data-quote-id="${removedObj}"]`)
    removeElement.remove()
  }

  quoteList.addEventListener("click", function(event){
    const targetId = event.target.parentElement.parentElement.dataset.quoteId

    if (event.target.innerText == "Delete"){
      //optimistic rendering
      deleteQuote(targetId)
      fetch(`${quotesUrl}/${targetId}`, {method: "DELETE"})
    }
    if (event.target.innerText.includes("Likes") && event.target.tagName == "BUTTON"){
      let hearts = parseInt(event.target.innerText.slice(6))
      //optimistic rendering
      event.target.innerText = `Likes: ${hearts + 1}`
      fetch(`${quotesUrl}/${targetId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({likes: hearts + 1})
      })
    }

  })
});
