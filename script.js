const form = document.getElementById("loginForm");
const msgBox = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      msgBox.innerHTML = `<p style="color:red">${data.message}</p>`;
    } else {
      msgBox.innerHTML = `<p style="color:green">${data.message}</p>`;
      // Redirect example:
      // window.location.href = "dashboard.html";
    }
  } catch (err) {
    msgBox.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
});
