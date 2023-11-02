document.addEventListener('DOMContentLoaded', () => {
    const eventList = document.querySelector('.event-list');
  
    // Fetch upcoming events from the server
    fetch('http://localhost:3000/upcoming-events')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const events = data.events;
  
          if (events.length > 0) {
            // Iterate through the events and create HTML elements to display each event
            events.forEach(event => {
              const eventItem = document.createElement('div');
              eventItem.classList.add('event-item');

  
              const eventName = document.createElement('h2');
              eventName.textContent = event.event_name;
  
              const location = document.createElement('p');
              location.textContent = `Location: ${event.location}`;
  
              const description = document.createElement('p');
              description.textContent = `Description: ${event.description}`;
  
            //   const dateRange = document.createElement('p');
            //   dateRange.textContent = `Date: ${event.date_from} to ${event.date_to}`;
            const dateFrom = new Date(event.date_from).toLocaleDateString();
            const dateTo = new Date(event.date_to).toLocaleDateString();
            const dateRange = document.createElement('p');
            dateRange.textContent = `Date: ${dateFrom} to ${dateTo}`;

  
              const timings = document.createElement('p');
              timings.textContent = `Timings: ${event.timings}`;
  
              const eventType = document.createElement('p');
              eventType.textContent = `Type of Event: ${event.event_type}`;
  
              const ticketPrice = document.createElement('p');
              ticketPrice.textContent = `Ticket Price: ₹${event.ticket_price}`;
  
              const maxParticipants = document.createElement('p');
              maxParticipants.textContent = `Max Participants: ${event.max_participants}`;
   
               const registerButton = document.createElement('button');
               registerButton.textContent = 'Register';
               registerButton.classList.add('button-register'); // Add the CSS class

               registerButton.addEventListener('click', () => {
  
               window.location.href = `event-registration.html?event_id=${event.event_id}`;
             });
          
              eventItem.appendChild(eventName);
              eventItem.appendChild(location);
              eventItem.appendChild(description);
              eventItem.appendChild(dateRange);
              eventItem.appendChild(timings);
              eventItem.appendChild(eventType);
              eventItem.appendChild(ticketPrice);
              eventItem.appendChild(maxParticipants);
              if(event.max_participants > 0)
              {
              eventItem.appendChild(registerButton);
              }else {
                // Display a message if the event is full
                // const fullMessage = document.createElement('p');
                // fullMessage.textContent = 'Sorry This event is already full';
                // eventItem.appendChild(fullMessage);
                const fullMessage = document.createElement('p');
                const boldText = document.createElement('strong'); // Create a <strong> element
                boldText.textContent = 'Sorry, this event is already full.';
                fullMessage.appendChild(boldText); // Append the <strong> element to the <p>
                eventItem.appendChild(fullMessage);
              }
  
          
  
              // Append the event item to the event list
              eventList.appendChild(eventItem);
            });
          } else {
            // Display a message if there are no upcoming events
            eventList.innerHTML = '<p>No upcoming events available.</p>';
          }
        } else {
          // Handle the case where fetching events was not successful
          eventList.innerHTML = '<p>Failed to fetch upcoming events.</p>';
        }
      });
  });