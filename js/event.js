const API_URL = "http://localhost:5000/api/events";

// Load events
async function loadEvents() {
  const res = await fetch(API_URL);
  const events = await res.json();

  const list = document.getElementById("eventsList");
  list.innerHTML = "";

  events.forEach(event => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${event.eventName} - ₹${event.totalAmount}</h3>
      <ul>
        ${event.members.map(m => `
          <li>
            ${m.name} (${m.email}) - ₹${m.amount} 
            ${m.paid ? "✅ Paid" : "❌ Pending"}
            ${!m.paid ? `<button onclick="markPaid('${event._id}','${m.email}')">Mark Paid</button>` : ""}
          </li>
        `).join("")}
      </ul>
      <button onclick="deleteEvent('${event._id}')">Delete</button>
    `;
    list.appendChild(div);
  });
}

// Create event
document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const eventName = document.getElementById("eventName").value;
  const totalAmount = document.getElementById("totalAmount").value;
  const payer = document.getElementById("payer").value;
  const membersRaw = document.getElementById("members").value.trim().split("\n");

  const members = membersRaw.map(line => {
    const [name, email] = line.split(":");
    return { name: name.trim(), email: email.trim() };
  });

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, totalAmount, payer, members })
  });

  loadEvents();
  e.target.reset();
});

// Mark member as paid
async function markPaid(eventId, memberEmail) {
  await fetch(`${API_URL}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, memberEmail })
  });
  loadEvents();
}

// Delete event
async function deleteEvent(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadEvents();
}

loadEvents();
