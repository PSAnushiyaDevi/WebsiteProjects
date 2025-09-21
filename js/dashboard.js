const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

// Redirect to login if not authenticated
if (!token) {
    window.location.href = "index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
const createEventBtn = document.getElementById("createEventBtn");
const eventsList = document.getElementById("eventsList");
const eventModal = document.getElementById("eventModal");
const closeModalBtn = document.querySelector(".close-modal-btn");
const eventForm = document.getElementById("eventForm");

logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});

createEventBtn.addEventListener("click", () => {
    eventModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
    eventModal.style.display = "none";
});

window.onclick = function(event) {
    if (event.target == eventModal) {
        eventModal.style.display = "none";
    }
};

eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventName = document.getElementById("eventName").value;
    const location = document.getElementById("location").value;
    const totalAmount = parseFloat(document.getElementById("totalAmount").value);
    const members = document.getElementById("members").value.split(",").map(email => email.trim());

    try {
        const res = await fetch(`${API_URL}/events/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ eventName, location, totalAmount, members }),
        });
        
        const data = await res.json();
        if (res.ok) {
            alert("Event created successfully!");
            eventModal.style.display = "none";
            fetchEvents();
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        alert("Server error. Check your connection.");
    }
});

async function fetchEvents() {
    try {
        const res = await fetch(`${API_URL}/events/my-events`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const events = await res.json();
        eventsList.innerHTML = "";

        if (events.length === 0) {
            eventsList.innerHTML = "<p class='info-msg'>No events found. Start by creating one!</p>";
        } else {
            events.forEach(event => {
                const card = document.createElement("div");
                card.className = "event-card";
                
                const membersList = event.members.map(member => {
                    const statusClass = member.paid ? "paid-status" : "unpaid-status";
                    const statusText = member.paid ? "✅ Paid" : "❌ Not Paid";
                    return `<li>${member.user.name}: ₹${member.amountToPay.toFixed(2)} <span class="${statusClass}">${statusText}</span></li>`;
                }).join('');

                const isPayer = event.paidBy.email === JSON.parse(localStorage.getItem("user")).email;
                const allPaid = event.members.every(m => m.paid);

                card.innerHTML = `
                    <h3>${event.eventName}</h3>
                    <p><strong>Paid By:</strong> ${event.paidBy.name}</p>
                    <p><strong>Total Amount:</strong> ₹${event.totalAmount.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${event.status}</p>
                    <h4>Members:</h4>
                    <ul>${membersList}</ul>
                    <div class="card-actions">
                        ${isPayer && allPaid ? `<button class="delete-btn btn" data-id="${event._id}">Delete Event</button>` : ''}
                        ${!allPaid ? `<button class="update-btn btn" data-id="${event._id}">Update Payment</button>` : ''}
                    </div>
                `;
                eventsList.appendChild(card);
            });
        }
        
        document.querySelectorAll(".update-btn").forEach(button => {
            button.addEventListener("click", updatePayment);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", deleteEvent);
        });

    } catch (err) {
        eventsList.innerHTML = "<p class='error-msg'>Failed to load events. Please try again later.</p>";
    }
}

async function updatePayment(e) {
    const eventId = e.target.dataset.id;
    const memberId = prompt("Enter the member ID of the person who paid:");

    if (!memberId) return;

    try {
        const res = await fetch(`${API_URL}/events/mark-paid`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ eventId, memberId }),
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            fetchEvents();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Failed to update payment.");
    }
}

async function deleteEvent(e) {
    const eventId = e.target.dataset.id;
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
        const res = await fetch(`${API_URL}/events/${eventId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            fetchEvents();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Failed to delete event.");
    }
}

// Initial fetch on page load
document.addEventListener("DOMContentLoaded", fetchEvents);