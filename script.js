console.log("Script başladı");

let articles = [];
let currentPage = 0;
const articlesPerPage = 4;

// Fetch articles from JSON file
fetch("content.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("JSON yüklendi:", data);
    articles = data.articles;
    displayArticles();
  })
  .catch((error) => {
    console.error("Error loading articles:", error);
    document.getElementById("content").innerHTML =
      "<p>Error loading articles. Please check the console for details.</p>";
  });

function createArticleElement(article) {
  const articleElement = document.createElement("div");
  articleElement.className = "article";

  const title = document.createElement("h2");
  title.textContent = article.title;
  articleElement.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `By ${article.author} on ${article.date}`;
  articleElement.appendChild(meta);

  article.content.forEach((item) => {
    if (item.type === "text") {
      const p = document.createElement("p");
      p.textContent = item.value;
      articleElement.appendChild(p);
    } else if (item.type === "code") {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = "python";
      code.textContent = item.value;
      pre.appendChild(code);

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "Copy";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(item.value);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 2000);
      });

      pre.appendChild(copyBtn);
      articleElement.appendChild(pre);
    }
  });

  return articleElement;
}

function displayArticles() {
  const contentElement = document.getElementById("content");
  contentElement.innerHTML = "";

  const startIndex = currentPage * articlesPerPage;
  const endIndex = Math.min(startIndex + articlesPerPage, articles.length);

  for (let i = startIndex; i < endIndex; i++) {
    const articleElement = createArticleElement(articles[i]);
    contentElement.appendChild(articleElement);
  }

  hljs.highlightAll();
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = (currentPage + 1) * articlesPerPage >= articles.length;
}

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    displayArticles();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if ((currentPage + 1) * articlesPerPage < articles.length) {
    currentPage++;
    displayArticles();
  }
});
