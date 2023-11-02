
const events = [
    {
      id: 1,
      name: "Event Name 1",
      date: "August 31, 2023",
      location: "Event Venue 1",
      price: "200/-",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      name: "Event Name 2",
      date: "September 15, 2023",
      location: "Event Venue 2",
      price: "250/-",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];
  
  // Function to display events on the page
  function displayEvents() {
    const eventList = document.querySelector(".event-list");
  
    events.forEach(event => {
      const eventItem = document.createElement("div");
      eventItem.classList.add("event-item");
      eventItem.innerHTML = `<h3>${event.name}</h3>
                             <p>Date: ${event.date}</p>
                             <p>Location: ${event.location}</p>
                             <p>Price: ${event.price}</p>
                             <button class="view-details" data-event-id="${event.id}">View Details</button>`;
      eventList.appendChild(eventItem);
    });
  
    // Add click event listener to each "View Details" button
    const viewButtons = document.querySelectorAll(".view-details");
    viewButtons.forEach(button => {
      button.addEventListener("click", event => {
        const eventId = event.target.getAttribute("data-event-id");
        window.location.href = `event-details.html?id=${eventId}`;
      });
    });
  }
  
  // Call the function to display events when the page loads
  window.addEventListener("load", displayEvents);
  